package com.example.netperf.service;

import com.example.netperf.models.Network;
import com.example.netperf.models.User;
import com.example.netperf.repository.NetworkRepository;
import com.example.netperf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NetworkService {

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HttpServletRequest request;

    public void savePerformance(String username, Network performance) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        performance.setUser(user);
        performance.setDateCreation(LocalDateTime.now());
        networkRepository.save(performance);
    }


    public List<Network> getUserPerformanceHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return networkRepository.findByUser(user);
    }
}

