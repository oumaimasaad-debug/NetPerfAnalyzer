package com.example.netperf.repository;

import com.example.netperf.models.Network;
import com.example.netperf.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NetworkRepository  extends JpaRepository<Network, Long>{
    List<Network> findByUser(User user);
}