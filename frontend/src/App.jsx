import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/requests")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load service requests");
          }

          return response.json();
        })
        .then((data) => {
          setRequests(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
  }, []);

  return (
      <div className="app">
        <header className="header">
          <div>
            <h1>Service Request Manager</h1>
            <p>Track and manage operational service requests.</p>
          </div>
        </header>

        <main className="container">
          <div className="section-header">
            <h2>Service Requests</h2>
            <span>{requests.length} requests</span>
          </div>

          {loading && <p>Loading requests...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && requests.length === 0 && (
              <p>No service requests found.</p>
          )}

          {!loading && !error && requests.length > 0 && (
              <div className="table-wrapper">
                <table>
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Technician</th>
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

                        <td>{request.priority}</td>

                        <td>{request.status}</td>

                        <td>
                          {request.assignedTechnician
                              ? request.assignedTechnician.name
                              : "Unassigned"}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </main>
      </div>
  );
}

export default App;