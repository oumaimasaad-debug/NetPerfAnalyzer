package com.example.netperf.request;

import com.example.netperf.models.Network;

public class PerformanceRequest {
    private String username;
    private Network performanceData;

    // Getters et Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Network getPerformanceData() {
        return performanceData;
    }

    public void setPerformanceData(Network performanceData) {
        this.performanceData = performanceData;
    }
}

