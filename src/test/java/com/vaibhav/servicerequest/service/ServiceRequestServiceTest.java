package com.vaibhav.servicerequest.service;

import com.vaibhav.servicerequest.dto.CreateServiceRequestRequest;
import com.vaibhav.servicerequest.exception.BadRequestException;
import com.vaibhav.servicerequest.model.*;
import com.vaibhav.servicerequest.repository.ServiceRequestRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceRequestServiceTest {

    @Mock
    private ServiceRequestRepository repository;

    @Mock
    private TechnicianService technicianService;

    private ServiceRequestService service;

    @BeforeEach
    void setUp() {
        service = new ServiceRequestService(
                repository,
                technicianService
        );
    }

    @Test
    void shouldCreateServiceRequest() {

        CreateServiceRequestRequest dto =
                new CreateServiceRequestRequest();

        dto.setTitle("Projector not working");
        dto.setDescription(
                "The projector in classroom 204 does not turn on.");
        dto.setCategory(RequestCategory.HARDWARE);
        dto.setPriority(Priority.HIGH);

        when(repository.save(any(ServiceRequest.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0));

        ServiceRequest result =
                service.createRequest(dto);

        assertEquals(
                "Projector not working",
                result.getTitle());

        assertEquals(
                RequestCategory.HARDWARE,
                result.getCategory());

        assertEquals(
                Priority.HIGH,
                result.getPriority());

        assertEquals(
                RequestStatus.OPEN,
                result.getStatus());

        verify(repository, times(1))
                .save(any(ServiceRequest.class));
    }

    @Test
    void shouldRejectResolvingRequestWithoutTechnician() {

        ServiceRequest request =
                new ServiceRequest(
                        "Wi-Fi outage",
                        "Conference room Wi-Fi is unavailable.",
                        RequestCategory.NETWORK,
                        Priority.HIGH
                );

        when(repository.findById(1L))
                .thenReturn(Optional.of(request));

        BadRequestException exception =
                assertThrows(
                        BadRequestException.class,
                        () -> service.updateStatus(
                                1L,
                                RequestStatus.RESOLVED)
                );

        assertEquals(
                "A technician must be assigned before a request can be resolved",
                exception.getMessage());

        verify(repository, never())
                .save(any(ServiceRequest.class));
    }

    @Test
    void shouldAssignTechnicianToRequest() {

        ServiceRequest request =
                new ServiceRequest(
                        "Laptop issue",
                        "Laptop will not boot.",
                        RequestCategory.HARDWARE,
                        Priority.MEDIUM
                );

        Technician technician =
                new Technician(
                        "Alex Johnson",
                        "alex.johnson@example.com",
                        "Hardware"
                );

        when(repository.findById(1L))
                .thenReturn(Optional.of(request));

        when(technicianService.getTechnicianById(1L))
                .thenReturn(technician);

        when(repository.save(request))
                .thenReturn(request);

        ServiceRequest result =
                service.assignTechnician(1L, 1L);

        assertNotNull(result.getAssignedTechnician());

        assertEquals(
                "Alex Johnson",
                result.getAssignedTechnician().getName());

        verify(repository, times(1))
                .save(request);
    }
}