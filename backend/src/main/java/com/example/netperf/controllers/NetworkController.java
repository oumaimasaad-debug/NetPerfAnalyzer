package com.example.netperf.controllers;

import com.example.netperf.repository.NetworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
@CrossOrigin(origins = "*", maxAge = 4800)
@RestController
public class NetworkController {
    private ServerSocket serverSocket;
    private Socket connectedSocket;

    @Autowired
    private NetworkRepository networkMetricsRepository;
    private static  String clientIpAddress;
    static class ByteCounter {
        long totalBytes = 0;
    }

    @GetMapping("/latence")
    public String testWebSocket() {
        return """
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Affichage de la Latence</title>
    <style>
                body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .latency {
            font-size: 24px;
            color: #333;
        }
        .error {
            color: red;
        }
    </style>
</head>
<body>
    <h1>Latence WebSocket</h1>
    <p class="latency" id="latencyDisplay">En attente des données...</p>
    <p class="error" id="errorMessage"></p>

    <script>
        // Connexion au WebSocket
        const socket = new WebSocket('ws://192.168.8.101:8080/ws/latency');

        // Références aux éléments HTML
        const latencyDisplay = document.getElementById('latencyDisplay');
        const errorMessage = document.getElementById('errorMessage');

        // Quand la connexion est ouverte
        socket.addEventListener('open', () => {
                latencyDisplay.textContent = 'Connexion établie. En attente de la latence...';
        });

        // Quand un message est reçu
        socket.addEventListener('message', (event) => {
                // Mise à jour de la latence
                latencyDisplay.textContent = event.data;
        });

        // Quand la connexion est fermée
        socket.addEventListener('close', () => {
                latencyDisplay.textContent = 'Connexion fermée.';
        });

        // En cas d'erreur
        socket.addEventListener('error', (error) => {
                errorMessage.textContent = 'Erreur WebSocket : Vérifiez votre connexion.';
        });
    </script>
</body>
</html>
                """;
    }

    // Page HTML avec JavaScript
    @GetMapping("/bandwith")
    public String index() {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test de débit en temps réel</title>
        </head>
        <body>
            <h1>Test de débit en temps réel</h1>
            <button onclick="startBandwidthTest()">Démarrer le test</button>
            <button onclick="stopBandwidthTest()">Arrêter le test</button>
            <p id="result"></p>
            <script>
                let socket;
                let totalDataReceived = 0;
                let startTime;

                function startBandwidthTest() {
                    socket = new WebSocket("ws://192.168.8.101:8080/ws/bandwidth");

                    socket.onopen = () => {
                        console.log("WebSocket connecté");
                        totalDataReceived = 0;
                        startTime = performance.now();
                    };

                    socket.onmessage = (event) => {
                        const dataSize = event.data.length; // Taille des données reçues (en caractères)
                        totalDataReceived += dataSize;

                        const currentTime = performance.now();
                        const elapsedTimeInSeconds = (currentTime - startTime) / 1000;

                        const bandwidthMbps = (totalDataReceived * 8) / (elapsedTimeInSeconds * 1024 * 1024); // Calcul en Mbps

                        document.getElementById("result").innerText =
                            `Débit en temps réel : ${bandwidthMbps.toFixed(2)} Mbps`;
                    };

                    socket.onclose = () => {
                        console.log("WebSocket déconnecté");
                    };

                    socket.onerror = (error) => {
                        console.error("Erreur WebSocket :", error);
                    };
                }

                function stopBandwidthTest() {
                    if (socket) {
                        socket.close();
                        console.log("Test arrêté.");
                    }
                }
            </script>
        </body>
        </html>
        """;
    }


    //pour afficher l'adresse ip
    @GetMapping("/ip")
    public String getClientIpAddress(HttpServletRequest request) {
        clientIpAddress = request.getRemoteAddr(); // Récupère l'adresse IP du client
        System.out.println("Client IP: " + clientIpAddress);
        return clientIpAddress;
    }
    ///Methode pour calculer latence et packet loss
    public static Object[] CalculateLatency(String adress) {
        long latency = -1;
        int packetLoss = -1;
        System.out.println("l'adresse que je veis pinger est" + adress);
        try {
            String command = (System.getProperty("os.name").startsWith("Windows"))
                    ? "ping -n 1 " + adress
                    : "ping -c 1 " + adress;

            Process process = Runtime.getRuntime().exec(command);
            process.waitFor();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));
            String line;
            boolean foundLatency = false;

            while ((line = reader.readLine()) != null) {
                if (line.contains("temps=") || line.contains("time=")) {
                    String[] parts = line.split("temps=|time=");
                    String[] timeParts = parts[1].split(" ");
                    latency = Long.parseLong(timeParts[0]);
                    foundLatency = true;
                }
                if (line.contains("perte") || line.contains("loss")) {
                    String[] parts = line.split(", ");
                    for (String part : parts) {
                        if (part.contains("%")) {
                            try {
                                packetLoss = Integer.parseInt(part.replaceAll("[^0-9]", ""));
                                break;
                            } catch (NumberFormatException e) {
                                System.out.println("Erreur lors de la conversion du pourcentage de perte : " + e.getMessage());
                            }
                        }
                    }
                }

            }

            if (!foundLatency) {
                latency=0;
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return new Object[]{latency, packetLoss};
    }


}




