package com.vaibhav.servicerequest.controller;

import com.vaibhav.servicerequest.dto.AssignTechnicianRequest;
import com.vaibhav.servicerequest.dto.CreateServiceRequestRequest;
import com.vaibhav.servicerequest.dto.UpdateServiceRequestRequest;
import com.vaibhav.servicerequest.dto.UpdateStatusRequest;
import com.vaibhav.servicerequest.model.Priority;
import com.vaibhav.servicerequest.model.RequestCategory;
import com.vaibhav.servicerequest.model.RequestStatus;
import com.vaibhav.servicerequest.model.ServiceRequest;
import com.vaibhav.servicerequest.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestService service;

    public ServiceRequestController(
            ServiceRequestService service) {

        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceRequest createRequest(
            @Valid @RequestBody
            CreateServiceRequestRequest request) {

        return service.createRequest(request);
    }

    @GetMapping
    public List<ServiceRequest> getAllRequests(

            @RequestParam(required = false)
            RequestStatus status,

            @RequestParam(required = false)
            Priority priority,

            @RequestParam(required = false)
            RequestCategory category) {

        return service.getAllRequests(
                status,
                priority,
                category);
    }

    @GetMapping("/{id}")
    public ServiceRequest getRequestById(
            @PathVariable Long id) {

        return service.getRequestById(id);
    }

    @PutMapping("/{id}")
    public ServiceRequest updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody
            UpdateServiceRequestRequest request) {

        return service.updateRequest(id, request);
    }

    @PatchMapping("/{id}/assign")
    public ServiceRequest assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody
            AssignTechnicianRequest request) {

        return service.assignTechnician(
                id,
                request.getTechnicianId());
    }

    @PatchMapping("/{id}/status")
    public ServiceRequest updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody
            UpdateStatusRequest request) {

        return service.updateStatus(
                id,
                request.getStatus());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRequest(
            @PathVariable Long id) {

        service.deleteRequest(id);
    }
}