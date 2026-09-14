package com.vaibhav.servicerequest.repository;

import com.vaibhav.servicerequest.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRequestRepository
        extends JpaRepository<ServiceRequest, Long> {
}