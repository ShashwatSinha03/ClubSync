'use client';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Feature States
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const params = new URLSearchParams({
          page,
          limit: 5, // Small limit to demonstrate pagination easily
          search,
          sort
        });

        const res = await fetch(`http://localhost:4000/events?${params}`, { headers });
        if (res.ok) {
          const data = await res.json();
          // Backend now returns { events, total, totalPages, currentPage }
          if (data.events && Array.isArray(data.events)) {
            setEvents(data.events);
            setTotalPages(data.totalPages);
          } else {
            setEvents([]);
          }
        } else {
          setEvents([]); 
        }
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search slightly or just fetch on every change (simplifying for now)
    const timeoutId = setTimeout(() => {
        if (user) fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [user, page, search, sort]);

  const deleteEvent = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    // Refresh by re-fetching or filtering locally (re-fetching ensures pagination consistency)
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Welcome to ClubSync</h1>
        <p style={{ color: 'var(--text-secondary)' }}>manage your club events effortlessly</p>
      </header>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Upcoming Events</h2>
        
        {/* Controls */}
        {user && (user.role === 'MEMBER' || user.role === 'ADMIN') && (
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="form-input"
                    style={{ width: '200px', padding: '8px' }}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                <select 
                    className="form-input" 
                    style={{ width: '120px', padding: '8px' }}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="asc">Date: Oldest</option>
                    <option value="desc">Date: Newest</option>
                </select>
            </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {events.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No events found.</p>
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
        
        {loading && <p style={{ textAlign: 'center' }}>Loading events...</p>}

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
            <p style={{ color: 'var(--primary-light)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button 
                className="btn btn-secondary" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{ opacity: page === 1 ? 0.5 : 1 }}
            >
                Previous
            </button>
            <span style={{ alignSelf: 'center', color: 'var(--text-secondary)' }}>
                Page {page} of {totalPages}
            </span>
            <button 
                className="btn btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                style={{ opacity: page === totalPages ? 0.5 : 1 }}
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
}
