package com.vaibhav.servicerequest.dto;

import com.vaibhav.servicerequest.model.RequestStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private RequestStatus status;

    public UpdateStatusRequest() {
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}