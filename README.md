# Service Request Management System

Live Demo - https://service-request-manager.netlify.app
A full-stack service management application built with Java, Spring Boot, React, and PostgreSQL for managing service requests, technician assignments, priorities, and request workflows.

## Overview

The Service Request Management System models a practical business workflow in which operational issues are submitted as service requests, assigned to technicians, and tracked through defined resolution stages.

The application combines a React frontend with a Spring Boot REST API and PostgreSQL database to support end-to-end service request management. The project applies full-stack development concepts including REST APIs, relational data persistence, validation, workflow rules, exception handling, frontend-backend integration, and unit testing.

## Features

- Create, retrieve, update, and delete service requests
- Create and retrieve technicians
- Assign technicians to service requests
- Track request categories and priorities
- Manage request workflow statuses
- Filter requests by status, priority, and category
- Create and manage requests through a React interface
- Validate incoming API requests
- Display backend validation and business-rule errors in the frontend
- Handle errors using centralized exception handling
- Persist application data using PostgreSQL
- Enforce workflow business rules
- Test service-layer functionality using JUnit and Mockito

## Technology Stack

### Backend

- Java 25
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven

### Frontend

- React
- Vite
- JavaScript
- CSS

### Testing & Development

- JUnit
- Mockito
- Postman
- Git
- GitHub

## Architecture

The application follows a layered full-stack architecture:

```text
React Frontend
      ↓
REST API
      ↓
Spring Boot Controllers
      ↓
Service Layer
      ↓
Business Rules
      ↓
Repository Layer
      ↓
JPA / Hibernate
      ↓
PostgreSQL
```

### Controller Layer

Receives HTTP requests and exposes REST API endpoints.

### Service Layer

Contains application logic and workflow business rules.

### Repository Layer

Provides database access through Spring Data JPA.

### Persistence Layer

Uses JPA and Hibernate to map Java entities to PostgreSQL tables.

## Domain Models

### ServiceRequest

Each service request contains:

- ID
- Title
- Description
- Category
- Priority
- Status
- Assigned technician
- Creation timestamp
- Last updated timestamp
- Resolution timestamp

### Technician

Each technician contains:

- ID
- Name
- Email
- Specialty

## Request Workflow

```text
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

Implemented business rules include:

- A request cannot be resolved without an assigned technician.
- Only resolved requests can be closed.
- Closed requests cannot be modified.

## REST API

### Technicians

```text
POST /api/technicians
GET  /api/technicians
GET  /api/technicians/{id}
```

### Service Requests

```text
POST   /api/requests
GET    /api/requests
GET    /api/requests/{id}
PUT    /api/requests/{id}
DELETE /api/requests/{id}
PATCH  /api/requests/{id}/assign
PATCH  /api/requests/{id}/status
```

## Filtering

Requests can be filtered using query parameters.

Examples:

```text
GET /api/requests?status=OPEN
GET /api/requests?priority=HIGH
GET /api/requests?category=HARDWARE
```

Filters can also be combined:

```text
GET /api/requests?priority=HIGH&category=HARDWARE
```

## Example Service Request

```json
{
  "title": "Projector not working",
  "description": "The projector in classroom 204 does not turn on.",
  "category": "HARDWARE",
  "priority": "HIGH"
}
```

## Database Configuration

The application uses PostgreSQL for persistent storage.

The PostgreSQL password is supplied using the environment variable:

```text
DB_PASSWORD
```

The password is not stored directly in the source code.

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/service_request_db
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}
```

## Testing

JUnit and Mockito are used for service-layer unit testing.

Current tests verify:

- Successful service request creation
- Technician assignment
- Rejection of request resolution when no technician is assigned

## Running the Backend

### Prerequisites

- Java 25
- PostgreSQL
- Maven

Create a PostgreSQL database named:

```text
service_request_db
```

Set the environment variable:

```text
DB_PASSWORD
```

to the PostgreSQL password.

Run:

```text
ServiceRequestManagerApplication
```

The backend starts at:

```text
http://localhost:8080
```

## Running the Frontend

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Future Improvements

Potential enhancements include:

- User authentication and role-based access
- SLA tracking and escalation
- Technician workload management
- Request comments and activity history
- Reporting and analytics
- Docker containerization
- Cloud deployment
