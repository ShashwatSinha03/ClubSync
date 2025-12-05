'use client';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://localhost:4000/events', { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEvents(data);
          } else {
            console.error('Events data is not an array:', data);
            setEvents([]);
          }
        } else {
          // If 403 or 401, we just don't show events or show a specific message
          setEvents([]); 
        }
      } catch (err) {
        console.error(err);
        setEvents([]);
      }
    };
    fetchEvents();
  }, [user]);

  const deleteEvent = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Welcome to ClubSync</h1>
        <p style={{ color: 'var(--text-secondary)' }}>manage your club events effortlessly</p>
      </header>
      
      <h2>Upcoming Events</h2>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {events.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No upcoming events.</p>
            {user && user.role === 'USER' && (
              <p style={{ color: 'var(--primary-light)', marginTop: '0.5rem' }}>
                Your account is pending approval. You will see events once an Admin approves your membership.
              </p>
            )}
            {!user && (
               <p style={{ marginTop: '0.5rem' }}>Login to view exclusive club events.</p>
            )}
          </div>
        )}
        {events.map((event) => (
          <div key={event.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{event.title}</h3>
              {user && user.role === 'ADMIN' && (
                <button 
                  onClick={() => deleteEvent(event.id)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.8rem', padding: '4px 8px', height: 'fit-content' }}
                >
                  Delete
                </button>
              )}
            </div>
            <p style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
