import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api";

function App() {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        category: "",
    });

    const [requestForm, setRequestForm] = useState({
        title: "",
        description: "",
        category: "HARDWARE",
        priority: "MEDIUM",
    });

    const [technicianForm, setTechnicianForm] = useState({
        name: "",
        email: "",
        specialty: "",
    });

    useEffect(() => {
        loadTechnicians();
    }, []);

    useEffect(() => {
        loadRequests();
    }, [filters]);

    async function handleResponse(response) {
        if (response.ok) {
            if (response.status === 204) {
                return null;
            }

            return response.json();
        }

        let message = "Something went wrong";

        try {
            const data = await response.json();

            if (data.message) {
                message = data.message;
            } else if (data.validationErrors) {
                message = Object.values(data.validationErrors).join(", ");
            }
        } catch {
            message = "Something went wrong";
        }

        throw new Error(message);
    }

    async function loadRequests() {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (filters.status) {
                params.append("status", filters.status);
            }

            if (filters.priority) {
                params.append("priority", filters.priority);
            }

            if (filters.category) {
                params.append("category", filters.category);
            }

            const query = params.toString();

            const url = query
                ? `${API_URL}/requests?${query}`
                : `${API_URL}/requests`;

            const response = await fetch(url);
            const data = await handleResponse(response);

            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadTechnicians() {
        try {
            const response = await fetch(`${API_URL}/technicians`);
            const data = await handleResponse(response);

            setTechnicians(data);
        } catch (err) {
            setError(err.message);
        }
    }

    async function createRequest(event) {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            const response = await fetch(`${API_URL}/requests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestForm),
            });

            await handleResponse(response);

            setRequestForm({
                title: "",
                description: "",
                category: "HARDWARE",
                priority: "MEDIUM",
            });

            setMessage("Service request created successfully.");

            await loadRequests();
        } catch (err) {
            setError(err.message);
        }
    }

    async function createTechnician(event) {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            const response = await fetch(`${API_URL}/technicians`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(technicianForm),
            });

            await handleResponse(response);

            setTechnicianForm({
                name: "",
                email: "",
                specialty: "",
            });

            setMessage("Technician created successfully.");

            await loadTechnicians();
        } catch (err) {
            setError(err.message);
        }
    }

    async function assignTechnician(requestId, technicianId) {
        if (!technicianId) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/requests/${requestId}/assign`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        technicianId: Number(technicianId),
                    }),
                }
            );

            await handleResponse(response);

            setMessage("Technician assigned successfully.");

            await loadRequests();
        } catch (err) {
            setError(err.message);
        }
    }

    async function updateStatus(requestId, status) {
        if (!status) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/requests/${requestId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            await handleResponse(response);

            setMessage("Request status updated successfully.");

            await loadRequests();
        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteRequest(requestId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service request?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/requests/${requestId}`,
                {
                    method: "DELETE",
                }
            );

            await handleResponse(response);

            setMessage("Service request deleted.");

            await loadRequests();
        } catch (err) {
            setError(err.message);
        }
    }

    function clearFilters() {
        setFilters({
            status: "",
            priority: "",
            category: "",
        });
    }

    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>Service Request Manager</h1>
                    <p>
                        Track operational issues, technicians, and request
                        workflows.
                    </p>
                </div>
            </header>

            <main className="container">
                {message && <div className="message">{message}</div>}

                {error && <div className="error">{error}</div>}

                <div className="form-grid">
                    <section className="card">
                        <h2>Create Service Request</h2>

                        <form onSubmit={createRequest}>
                            <label>
                                Title
                                <input
                                    type="text"
                                    value={requestForm.title}
                                    onChange={(event) =>
                                        setRequestForm({
                                            ...requestForm,
                                            title: event.target.value,
                                        })
                                    }
                                    placeholder="Projector not working"
                                    required
                                />
                            </label>

                            <label>
                                Description
                                <textarea
                                    value={requestForm.description}
                                    onChange={(event) =>
                                        setRequestForm({
                                            ...requestForm,
                                            description: event.target.value,
                                        })
                                    }
                                    placeholder="Describe the issue..."
                                    required
                                />
                            </label>

                            <div className="two-columns">
                                <label>
                                    Category
                                    <select
                                        value={requestForm.category}
                                        onChange={(event) =>
                                            setRequestForm({
                                                ...requestForm,
                                                category: event.target.value,
                                            })
                                        }
                                    >
                                        <option value="HARDWARE">Hardware</option>
                                        <option value="SOFTWARE">Software</option>
                                        <option value="NETWORK">Network</option>
                                        <option value="FACILITIES">Facilities</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </label>

                                <label>
                                    Priority
                                    <select
                                        value={requestForm.priority}
                                        onChange={(event) =>
                                            setRequestForm({
                                                ...requestForm,
                                                priority: event.target.value,
                                            })
                                        }
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </label>
                            </div>

                            <button type="submit">
                                Create Request
                            </button>
                        </form>
                    </section>

                    <section className="card">
                        <h2>Create Technician</h2>

                        <form onSubmit={createTechnician}>
                            <label>
                                Name
                                <input
                                    type="text"
                                    value={technicianForm.name}
                                    onChange={(event) =>
                                        setTechnicianForm({
                                            ...technicianForm,
                                            name: event.target.value,
                                        })
                                    }
                                    placeholder="Alex Johnson"
                                    required
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    value={technicianForm.email}
                                    onChange={(event) =>
                                        setTechnicianForm({
                                            ...technicianForm,
                                            email: event.target.value,
                                        })
                                    }
                                    placeholder="alex@example.com"
                                    required
                                />
                            </label>

                            <label>
                                Specialty
                                <input
                                    type="text"
                                    value={technicianForm.specialty}
                                    onChange={(event) =>
                                        setTechnicianForm({
                                            ...technicianForm,
                                            specialty: event.target.value,
                                        })
                                    }
                                    placeholder="Hardware"
                                    required
                                />
                            </label>

                            <button type="submit">
                                Create Technician
                            </button>
                        </form>

                        <div className="technician-count">
                            {technicians.length} technicians available
                        </div>
                    </section>
                </div>

                <section className="requests-section">
                    <div className="section-header">
                        <div>
                            <h2>Service Requests</h2>
                            <span>{requests.length} matching requests</span>
                        </div>
                    </div>

                    <div className="filters">
                        <select
                            value={filters.status}
                            onChange={(event) =>
                                setFilters({
                                    ...filters,
                                    status: event.target.value,
                                })
                            }
                        >
                            <option value="">All Statuses</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>

                        <select
                            value={filters.priority}
                            onChange={(event) =>
                                setFilters({
                                    ...filters,
                                    priority: event.target.value,
                                })
                            }
                        >
                            <option value="">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>

                        <select
                            value={filters.category}
                            onChange={(event) =>
                                setFilters({
                                    ...filters,
                                    category: event.target.value,
                                })
                            }
                        >
                            <option value="">All Categories</option>
                            <option value="HARDWARE">Hardware</option>
                            <option value="SOFTWARE">Software</option>
                            <option value="NETWORK">Network</option>
                            <option value="FACILITIES">Facilities</option>
                            <option value="OTHER">Other</option>
                        </select>

                        <button
                            className="secondary-button"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>

                    {loading && <p>Loading requests...</p>}

                    {!loading && requests.length === 0 && (
                        <div className="empty-state">
                            No service requests found.
                        </div>
                    )}

                    {!loading && requests.length > 0 && (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Request</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Technician</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>

                                        <td>
                                            <strong>{request.title}</strong>

                                            <div className="description">
                                                {request.description}
                                            </div>
                                        </td>

                                        <td>{request.category}</td>

                                        <td>
                        <span
                            className={`badge priority-${request.priority.toLowerCase()}`}
                        >
                          {request.priority}
                        </span>
                                        </td>

                                        <td>
                                            <select
                                                value={
                                                    request.assignedTechnician?.id || ""
                                                }
                                                disabled={request.status === "CLOSED"}
                                                onChange={(event) =>
                                                    assignTechnician(
                                                        request.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="">Unassigned</option>

                                                {technicians.map((technician) => (
                                                    <option
                                                        key={technician.id}
                                                        value={technician.id}
                                                    >
                                                        {technician.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td>
                                            <select
                                                value={request.status}
                                                disabled={request.status === "CLOSED"}
                                                onChange={(event) =>
                                                    updateStatus(
                                                        request.id,
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="OPEN">Open</option>
                                                <option value="IN_PROGRESS">
                                                    In Progress
                                                </option>
                                                <option value="RESOLVED">
                                                    Resolved
                                                </option>
                                                <option value="CLOSED">
                                                    Closed
                                                </option>
                                            </select>
                                        </td>

                                        <td>
                                            <button
                                                className="danger-button"
                                                onClick={() =>
                                                    deleteRequest(request.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;