"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import fetcher from "../../lib/fetcher";
import { useEffect, useState } from "react";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Dash />
    </ProtectedRoute>
  );
}

function Dash() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async()=>{
      const res = await fetcher("/api/events");
      setEvents(res.events || []);
    })();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="card">
        {events.length === 0 && (
          <p style={{color:"var(--text-secondary)"}}>No events yet.</p>
        )}
        {events.map(ev => (
          <div key={ev.id} style={{padding:"6px 0", borderBottom:"1px solid var(--border)"}}>
            <strong>{ev.title}</strong><br/>
            <small>{new Date(ev.date).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
