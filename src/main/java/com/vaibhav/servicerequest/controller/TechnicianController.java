package com.vaibhav.servicerequest.controller;

import com.vaibhav.servicerequest.dto.CreateTechnicianRequest;
import com.vaibhav.servicerequest.model.Technician;
import com.vaibhav.servicerequest.service.TechnicianService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    private final TechnicianService service;

    public TechnicianController(
            TechnicianService service) {

        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Technician createTechnician(
            @Valid @RequestBody
            CreateTechnicianRequest request) {

        return service.createTechnician(request);
    }

    @GetMapping
    public List<Technician> getAllTechnicians() {

        return service.getAllTechnicians();
    }

    @GetMapping("/{id}")
    public Technician getTechnicianById(
            @PathVariable Long id) {

        return service.getTechnicianById(id);
    }
}