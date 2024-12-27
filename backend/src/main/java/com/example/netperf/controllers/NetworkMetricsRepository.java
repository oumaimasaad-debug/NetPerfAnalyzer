package com.example.netperf.controllers;

import com.example.netperf.models.Network;
import com.example.netperf.request.PerformanceRequest;
import com.example.netperf.models.User;
import com.example.netperf.repository.NetworkRepository;
import com.example.netperf.repository.UserRepository;
import com.example.netperf.service.NetworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
@CrossOrigin(origins = "*", maxAge = 4800)
@RestController
@RequestMapping("/api/network-metrics")
public class NetworkMetricsRepository {

    @Autowired
    private NetworkRepository networkMetricsRepository;

    @Autowired
    private NetworkService performanceService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    NetworkRepository networkRepository;

    @PostMapping
    public ResponseEntity<String> saveMetrics(@RequestBody Network metrics) {
        metrics.setDateCreation(LocalDateTime.now());
        networkMetricsRepository.save(metrics);
        return ResponseEntity.ok("Metrics saved successfully");
    }
    @PostMapping("/save")
    public void savePerformance(@RequestBody PerformanceRequest request) {
        String username = request.getUsername();
        Network performanceData = request.getPerformanceData();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        performanceData.setUser(user);
        performanceData.setDateCreation(LocalDateTime.now());
        networkMetricsRepository.save(performanceData);
    }

    @GetMapping
    public ResponseEntity<List<Network>> getMetricsHistory() {
        List<Network> history = networkMetricsRepository.findAll();
        return ResponseEntity.ok(history);
    }
    @GetMapping("/history")
    public ResponseEntity<List<Network>> getPerformanceHistory(@RequestParam String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<Network> history =networkMetricsRepository.findByUser(user);
       return ResponseEntity.ok(history);
    }
    @GetMapping("/login")
    public String showLoginPage() {
        return "login"; // Retourne le nom de la vue "login.html"
    }
}

