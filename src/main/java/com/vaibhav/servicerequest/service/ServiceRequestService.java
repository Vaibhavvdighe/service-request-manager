package com.vaibhav.servicerequest.service;

import com.vaibhav.servicerequest.dto.CreateServiceRequestRequest;
import com.vaibhav.servicerequest.dto.UpdateServiceRequestRequest;
import com.vaibhav.servicerequest.exception.BadRequestException;
import com.vaibhav.servicerequest.exception.ResourceNotFoundException;
import com.vaibhav.servicerequest.model.*;
import com.vaibhav.servicerequest.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository repository;
    private final TechnicianService technicianService;

    public ServiceRequestService(
            ServiceRequestRepository repository,
            TechnicianService technicianService) {

        this.repository = repository;
        this.technicianService = technicianService;
    }

    public ServiceRequest createRequest(
            CreateServiceRequestRequest request) {

        ServiceRequest serviceRequest =
                new ServiceRequest(
                        request.getTitle(),
                        request.getDescription(),
                        request.getCategory(),
                        request.getPriority()
                );

        return repository.save(serviceRequest);
    }

    public List<ServiceRequest> getAllRequests(
            RequestStatus status,
            Priority priority,
            RequestCategory category) {

        return repository.findAll()
                .stream()
                .filter(request ->
                        status == null ||
                                request.getStatus() == status)
                .filter(request ->
                        priority == null ||
                                request.getPriority() == priority)
                .filter(request ->
                        category == null ||
                                request.getCategory() == category)
                .toList();
    }

    public ServiceRequest getRequestById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Service request not found with ID: " + id));
    }

    public ServiceRequest updateRequest(
            Long id,
            UpdateServiceRequestRequest update) {

        ServiceRequest request = getRequestById(id);

        request.setTitle(update.getTitle());
        request.setDescription(update.getDescription());
        request.setCategory(update.getCategory());
        request.setPriority(update.getPriority());

        return repository.save(request);
    }

    public ServiceRequest assignTechnician(
            Long requestId,
            Long technicianId) {

        ServiceRequest request =
                getRequestById(requestId);

        Technician technician =
                technicianService.getTechnicianById(
                        technicianId);

        request.setAssignedTechnician(technician);

        return repository.save(request);
    }

    public ServiceRequest updateStatus(
            Long id,
            RequestStatus newStatus) {

        ServiceRequest request =
                getRequestById(id);

        if (request.getStatus() == RequestStatus.CLOSED) {

            throw new BadRequestException(
                    "Closed requests cannot be modified");
        }

        if (newStatus == RequestStatus.RESOLVED &&
                request.getAssignedTechnician() == null) {

            throw new BadRequestException(
                    "A technician must be assigned before a request can be resolved");
        }

        if (newStatus == RequestStatus.CLOSED &&
                request.getStatus() != RequestStatus.RESOLVED) {

            throw new BadRequestException(
                    "Only resolved requests can be closed");
        }

        request.setStatus(newStatus);

        if (newStatus == RequestStatus.RESOLVED) {
            request.setResolvedAt(LocalDateTime.now());
        }

        return repository.save(request);
    }

    public void deleteRequest(Long id) {

        ServiceRequest request =
                getRequestById(id);

        repository.delete(request);
    }
}