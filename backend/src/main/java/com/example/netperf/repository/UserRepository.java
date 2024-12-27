package com.example.netperf.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.netperf.models.User;

public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByUsername(String username);

	Boolean existsByUsername(String username);

	Boolean existsByEmail(String email);
}
