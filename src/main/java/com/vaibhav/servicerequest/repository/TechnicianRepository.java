package com.vaibhav.servicerequest.repository;

import com.vaibhav.servicerequest.model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechnicianRepository
        extends JpaRepository<Technician, Long> {

    Optional<Technician> findByEmail(String email);
}