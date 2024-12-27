package com.example.netperf.repository;


import com.example.netperf.controllers.BandwidthWebSocketHandler;
import com.example.netperf.controllers.LatencyWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new BandwidthWebSocketHandler(), "/ws/bandwidth")
                .setAllowedOrigins("*"); // Autoriser tous les domaines, à ajuster pour la sécurité
        registry.addHandler(new LatencyWebSocketHandler(), "/ws/latency")
                .setAllowedOrigins("*");
    }
}