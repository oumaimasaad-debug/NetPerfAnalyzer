package com.example.netperf.controllers;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class BandwidthWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Nouvelle connexion WebSocket : " + session.getId());

        // Simuler l'envoi continu de données
        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

        executorService.scheduleAtFixedRate(() -> {
            try {
                // Envoyer un bloc de données de 1 Mo (ou une autre taille)
                StringBuilder data = new StringBuilder();
                for (int i = 0; i < 1024 * 1024; i++) {
                    data.append("A"); // 1 Mo de données
                }
                session.sendMessage(new TextMessage(data.toString()));
            } catch (Exception e) {
                System.out.println("Erreur lors de l'envoi de données : " + e.getMessage());
                executorService.shutdown();
            }
        }, 0, 1, TimeUnit.SECONDS); // Envoi toutes les secondes
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        System.out.println("Connexion fermée : " + session.getId());
    }
}

