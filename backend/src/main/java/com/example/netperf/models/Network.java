package com.example.netperf.models;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity

@NoArgsConstructor
@AllArgsConstructor

public class Network {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double latence;
    private double debit;
    private int packetlost;
    @ManyToOne
    User user;

    private LocalDateTime dateCreation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getLatence() {
        return latence;
    }

    public void setLatence(double latence) {
        this.latence = latence;
    }

    public double getDebit() {
        return debit;
    }

    public void setDebit(double debit) {
        this.debit = debit;
    }

    public int getPacketlost() {
        return packetlost;
    }

    public void setPacketlost(int packetlost) {
        this.packetlost = packetlost;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}




