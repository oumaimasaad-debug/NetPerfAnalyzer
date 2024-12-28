import React, { useEffect, useState } from "react";
import axios from "axios";
import './styles.css';
import UserService from './UserService';
import { useHistory } from 'react-router-dom'; // Importez useHistory pour v5

const TestHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const historyObj = useHistory(); // Utilisez useHistory pour v5
  const username = UserService.getCurrentUser(); // Récupération de l'utilisateur actuel

  useEffect(() => {
    const fetchHistory = async () => {
          const data = {
            username: username
          };
      try {
            const response = await axios.get('http://localhost:8080/api/network-metrics/history', {
                params: { username: username }
              });
        console.log("Nom d'utilisateur actuel :", username);
        console.log("Données reçues :", response.data); // Afficher les données dans la console

        if (response.status === 200) {
          setHistory(response.data);
        } else {
          setError(`Erreur : ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error("Erreur détaillée :", error.response || error.message || error);
        setError("Impossible de récupérer l'historique des tests.");
      }
    };

    fetchHistory();
  }, [username]); // Ajoutez username comme dépendance pour éviter les erreurs

  return (
    <div className="container">
      <h3>Historique des Tests</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {history.length === 0 ? (
        <p>Aucun test enregistré pour le moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Latence (ms)</th>
              <th>Débit (Mbps)</th>
              <th>Perte de paquets (%)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((test, index) => (
              <tr key={index}>
                <td>{new Date(test.dateCreation).toLocaleString()}</td>
                <td>{test.latence}</td>
                <td>{test.debit}</td>
                <td>{test.packetlost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => historyObj.push('/')}>Retour au Test</button> {/* Utilisation de history.push() pour la navigation */}
    </div>
  );
};

export default TestHistory;
