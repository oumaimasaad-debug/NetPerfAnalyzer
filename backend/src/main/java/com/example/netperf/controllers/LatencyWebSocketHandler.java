package com.example.netperf.controllers;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class LatencyWebSocketHandler extends TextWebSocketHandler {


    public LatencyWebSocketHandler() {

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connexion WebSocket établie : " + session.getId());

        // Si vous avez besoin de l'adresse IP du client, vous pouvez la récupérer de cette manière
        String remoteAddress = session.getRemoteAddress().getAddress().getHostAddress();
        System.out.println("Adresse IP du client : " + remoteAddress);
        // Planifier le calcul de la latence toutes les secondes
        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);
        NetworkController ct = new NetworkController();
        executorService.scheduleAtFixedRate(() -> {
            try {
                // Appel de la méthode CalculateLatency
                Object[] result = ct.CalculateLatency(remoteAddress);
                long latency = (long) result[0];
                int packetLoss = (int) result[1];

                // Envoyer les résultats au client
                if (latency != -1) {
                    session.sendMessage(new TextMessage("Latence: " + latency + " ms, Perte de paquets: " + packetLoss + "%"));
                } else {
                    session.sendMessage(new TextMessage("Erreur : Impossible de calculer la latence."));
                }
            } catch (Exception e) {
                System.out.println("Erreur lors de l'envoi des résultats : " + e.getMessage());
                executorService.shutdown();
            }
        }, 0, 1, TimeUnit.SECONDS);
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        System.out.println("Connexion WebSocket fermée : " + session.getId());
    }



}
