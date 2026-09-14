package com.vaibhav.servicerequest.service;

import com.vaibhav.servicerequest.dto.CreateTechnicianRequest;
import com.vaibhav.servicerequest.exception.BadRequestException;
import com.vaibhav.servicerequest.exception.ResourceNotFoundException;
import com.vaibhav.servicerequest.model.Technician;
import com.vaibhav.servicerequest.repository.TechnicianRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TechnicianService {

    private final TechnicianRepository repository;

    public TechnicianService(
            TechnicianRepository repository) {

        this.repository = repository;
    }

    public Technician createTechnician(
            CreateTechnicianRequest request) {

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException(
                    "A technician with this email already exists");
        }

        Technician technician =
                new Technician(
                        request.getName(),
                        request.getEmail(),
                        request.getSpecialty()
                );

        return repository.save(technician);
    }

    public List<Technician> getAllTechnicians() {
        return repository.findAll();
    }

    public Technician getTechnicianById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Technician not found with ID: " + id));
    }
}