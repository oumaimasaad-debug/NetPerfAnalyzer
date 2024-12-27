import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useHistory } from 'react-router-dom';
import html2canvas from "html2canvas";
import './NetworkTest.css';
import UserService from './UserService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const NetworkTest = () => {
  const [latency, setLatency] = useState(null);
  const [packetLoss, setPacketLoss] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState('');
  const [latencyData, setLatencyData] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [bandwidth, setBandwidth] = useState(null);
  const [bandwidthData, setBandwidthData] = useState([]);
  const [averageBandwidth, setAverageBandwidth] = useState(0);
  const [latencySocket, setLatencySocket] = useState(null);
  const maxDataPoints = 30;
 const username = UserService.getCurrentUser();

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
        console.log('WebSocket déconnecté');
      }
    };
  }, [socket]);

  const startTests = () => {
    setIsTesting(true);
    startLatencyTest();
    startBandwidthTest();
  };

  const calculateAverageLatency = () => {
    if (latencyData.length === 0) return 0;
    const sum = latencyData.reduce((acc, value) => acc + value, 0);
    return (sum / latencyData.length).toFixed(2);
  };

  const calculateAverageBandwidth = (data) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, value) => acc + value, 0);
    return (sum / data.length).toFixed(2);
  };

  const saveMetrics = async (averageLatency) => {

  console.log("Nom d'utilisateur actuel :", username);
    try {
      const metrics = {
        latence: parseFloat(averageLatency),
        debit: parseFloat(averageBandwidth),
        packetlost: packetLoss,
      };
      const data = {
        username: username, // ou un autre moyen d'obtenir le username
        performanceData: metrics
      };

      const response = await axios.post('http://192.168.22.56:8080/api/network-metrics/save',data);
      console.log(response.data);
      alert('Les métriques ont été sauvegardées avec succès.');
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des métriques :", error);
      alert('Erreur lors de la sauvegarde des métriques.');
    }
  };

  const startLatencyTest = () => {
    if (isTesting) {
      setError('Le test de latence est déjà en cours.');
      return;
    }
    setError('');
    setIsTesting(true);

    const newLatencySocket = new WebSocket("ws://192.168.0.167:8080/ws/latency");

    newLatencySocket.onopen = () => {
      console.log('WebSocket de latence connecté');
      setLatency('Connexion établie. En attente de la latence...');
    };

    newLatencySocket.onmessage = (event) => {
      const message = event.data.trim();
      console.log('Message reçu : ', message);

      if (message.startsWith('Latence:')) {
        const newLatency = parseFloat(message.split(':')[1].trim());
        setLatency(newLatency);
        setLatencyData(prevData => {
          const updatedData = [...prevData, newLatency];
          return updatedData.length > maxDataPoints ? updatedData.slice(1) : updatedData;
        });
      }

      if (message.startsWith('Perte de paquets:')) {
        const newPacketLoss = parseFloat(message.split(':')[1].trim());
        setPacketLoss(newPacketLoss);
      }

      const timestamp = new Date().toLocaleTimeString();
      setTimeStamps(prevTimestamps => {
        const updatedTimestamps = [...prevTimestamps, timestamp];
        return updatedTimestamps.length > maxDataPoints ? updatedTimestamps.slice(1) : updatedTimestamps;
      });
    };

    newLatencySocket.onclose = () => {
      console.log('WebSocket de latence déconnecté');
      setIsTesting(false);
    };

    newLatencySocket.onerror = (error) => {
      console.error('Erreur WebSocket de latence :', error);
      setError('Erreur WebSocket : Vérifiez votre connexion.');
      setIsTesting(false);
    };

    setLatencySocket(newLatencySocket);
  };

  const startBandwidthTest = () => {
    if (isTesting) {
      setError("Le test de débit est déjà en cours.");
      return;
    }

    setError("");
    setIsTesting(true);
    const newSocket = new WebSocket("ws://192.168.22.56:8080/ws/bandwidth");
    setSocket(newSocket);

    let totalDataReceived = 0;
    let startTime = performance.now();

    newSocket.onopen = () => {
      console.log("WebSocket connecté");
      totalDataReceived = 0;
      startTime = performance.now();
    };

    newSocket.onmessage = (event) => {
      const dataSize = event.data.length;
      totalDataReceived += dataSize;

      const currentTime = performance.now();
      const elapsedTimeInSeconds = (currentTime - startTime) / 1000;

      const bandwidthMbps =
        (totalDataReceived * 8) / (elapsedTimeInSeconds * 1024 * 1024);
      setBandwidth(bandwidthMbps.toFixed(2));

      const timestamp = new Date().toLocaleTimeString();
      setBandwidthData((prevData) => {
        const updatedData = [...prevData, parseFloat(bandwidthMbps.toFixed(2))];
        const average = calculateAverageBandwidth(updatedData);
        setAverageBandwidth(average);
        return updatedData.length > maxDataPoints
          ? updatedData.slice(1)
          : updatedData;
      });
      setTimeStamps((prevTimestamps) => {
        const updatedTimestamps = [...prevTimestamps, timestamp];
        return updatedTimestamps.length > maxDataPoints
          ? updatedTimestamps.slice(1)
          : updatedTimestamps;
      });
    };

    newSocket.onclose = () => {
      console.log("WebSocket déconnecté");
      setIsTesting(false);
    };

    newSocket.onerror = (error) => {
      console.error("Erreur WebSocket :", error);
      setError("Erreur WebSocket : Vérifiez votre connexion.");
      setIsTesting(false);
    };
  };

  const stopTests = () => {
    if (socket) {
      socket.close();
      console.log("Tests arrêtés.");
      setIsTesting(false);
    }
    if (latencySocket) {
      latencySocket.close();
      console.log("Test de latence arrêté.");
      setIsTesting(false);
    }

    const averageLatency = calculateAverageLatency();
    console.log("Latence moyenne :", averageLatency);
    saveMetrics(averageLatency);
  };

  const chartDataLatency = {
    labels: timeStamps,
    datasets: [
      {
        label: 'Latence (ms)',
        data: latencyData,
        borderColor: 'rgba(255, 105, 180, 1)', // Couleur de la courbe
        backgroundColor: 'rgba(255, 105, 180, 0.2)', // Couleur du fond léger
        fill: true, // Remplissage sous la courbe
        tension: 0.4, // Rendre la courbe plus fluide
        pointRadius: 5, // Taille des points
        pointBackgroundColor: 'rgba(255, 105, 180, 1)', // Couleur des points
        borderWidth: 3, // Épaisseur de la ligne
        pointHoverRadius: 8, // Taille du point au survol
      },
    ],
  };

 const chartData = {
   labels: timeStamps,
   datasets: [
     {
       label: "Débit (Mbps)",
       data: bandwidthData,
       borderColor: "rgba(0, 0, 128, 1)", // Couleur bleu marine pour la courbe
       backgroundColor: "rgba(0, 0, 128, 0.2)", // Fond léger bleu marine
       fill: true, // Remplissage sous la courbe
       tension: 0.4, // Rendre la courbe plus fluide
       pointRadius: 5, // Taille des points
       pointBackgroundColor: 'rgba(0, 0, 128, 1)', // Couleur bleu marine des points
       borderWidth: 2, // Épaisseur de la ligne
       pointHoverRadius: 8, // Taille du point au survol
     },
   ],

    scales: {
      x: {
        title: {
          display: true,
          text: 'Temps',
          color: '#000',
        },
        grid: {
          color: '#e1e1e1', // Couleur des lignes de grille
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valeur',
          color: '#000',
        },
        grid: {
          color: '#e1e1e1', // Couleur des lignes de grille
        },
      },
    },

  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Temps",
        },
      },
      y: {
        title: {
          display: true,

        },
      },
    },
  };

 const generateReport = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let currentY = 10; // Position Y de départ

    // Récupérer la date actuelle du test
    const testDate = new Date().toLocaleString();  // Format local de la date et heure

    // Ajouter un titre
    pdf.setFontSize(18);
    pdf.text("Rapport de Test Réseau", 10, currentY);
    currentY += 15; // Augmenter l'espacement après le titre

    // Ajouter la date du test
    pdf.setFontSize(12);
    pdf.text(`Date du test : ${testDate}`, 10, currentY);
    currentY += 10; // Espacement après la date

    // Détails des tests
    const startTime = timeStamps[0] || "N/A";
    const endTime = timeStamps[timeStamps.length - 1] || "N/A";
    const maxLatency = latencyData.length ? Math.max(...latencyData) : "N/A";
    const minLatency = latencyData.length ? Math.min(...latencyData) : "N/A";
    const maxBandwidth = bandwidthData.length ? Math.max(...bandwidthData) : "N/A";
    const minBandwidth = bandwidthData.length ? Math.min(...bandwidthData) : "N/A";

    pdf.text(`Durée du test : ${startTime} - ${endTime}`, 10, currentY);
    currentY += 10;
    pdf.text(`Latence moyenne : ${calculateAverageLatency()} ms`, 10, currentY);
    currentY += 10;
    pdf.text(`Latence maximale : ${maxLatency} ms`, 10, currentY);
    currentY += 10;
    pdf.text(`Latence minimale : ${minLatency} ms`, 10, currentY);
    currentY += 10;
    pdf.text(`Débit moyen : ${averageBandwidth} Mbps`, 10, currentY);
    currentY += 10;
    pdf.text(`Débit maximal : ${maxBandwidth} Mbps`, 10, currentY);
    currentY += 10;
    pdf.text(`Débit minimal : ${minBandwidth} Mbps`, 10, currentY);
    currentY += 10;
    pdf.text(`Perte de paquets : ${packetLoss}%`, 10, currentY);
    currentY += 15; // Plus d'espace avant la section des détails

    // Section Détails des Tests
    pdf.setFontSize(12);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Détails des Tests:", 14, currentY);
    currentY += 10; // Espacement après le titre de section

    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Latence (ms): ${latencyData.join(", ")}`, 10, currentY);
    currentY += 10;
    pdf.text(`Débit (Mbps): ${bandwidthData.join(", ")}`, 10, currentY);
    currentY += 8; // Espacement avant d'ajouter les graphiques

    // Ajouter les graphiques
    const latencyGraph = document.getElementById("latencyGraph");
    const bandwidthGraph = document.getElementById("bandwidthGraph");

    if (latencyGraph) {

      const latencyCanvas = await html2canvas(latencyGraph, {
        scale: 2, // Augmente la qualité de la capture
        width: latencyGraph.scrollWidth, // Capture la largeur complète
        height: latencyGraph.scrollHeight // Capture la hauteur complète
      });
      const latencyImg = latencyCanvas.toDataURL("image/png");
      pdf.addImage(latencyImg, "PNG", 10,currentY  , 190, 80); // Ajuster la taille d'image si nécessaire
      currentY += 85; // Ajuster l'espacement après le graphique de latence
    }

    if (bandwidthGraph) {
      pdf.addPage();
      const bandwidthCanvas = await html2canvas(bandwidthGraph, {
        scale: 2, // Augmente la qualité de la capture
        width: bandwidthGraph.scrollWidth, // Capture la largeur complète
        height: bandwidthGraph.scrollHeight // Capture la hauteur complète
      });
      const bandwidthImg = bandwidthCanvas.toDataURL("image/png");
      pdf.addImage(bandwidthImg, "PNG", 10, 10, 190, 80); // Ajuster la taille d'image si nécessaire
    }

    // Télécharger le fichier PDF
    pdf.save("rapport-test-reseau.pdf");
 };


   return (
<div>
  <h2>Test de Performance Réseau</h2>
  <div className="button-container">
    <button className="start" onClick={startTests}>Go</button>
    <button className="stop" onClick={stopTests}>Stop</button>
  </div>

  <p>Latence : {latency}</p>
  <p>Latence moyenne : {calculateAverageLatency()}</p>
  <p>Perte de paquets : {packetLoss}%</p>
  <p>Débit : {bandwidth}</p>
  <p>Débit moyen : {averageBandwidth}</p>

  {error && <p style={{ color: 'red' }}>{error}</p>}

<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flexGrow: 1 }}>
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '80px' }}>
    <div id="latencyGraph" style={{ height: "300px", width: "80%" }}>
      <h3 style={{ color: '#D5006D' }}>Graphique de la Latence</h3>
      <Line data={chartDataLatency} options={chartOptions} />
    </div>

    <div id="bandwidthGraph" style={{ height: "300px", width: "80%" }}>
      <h3 style={{ color: '#003366' }}>Graphique du Débit</h3>
      <Line data={chartData} options={chartOptions} />
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', paddingBottom: '20px' }}>
      <button onClick={generateReport}>Générer un rapport</button>
    </div>
  </div>
</div>
</div>


     );
 };

 export default NetworkTest;