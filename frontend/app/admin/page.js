'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchUsers();
      }
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers(await res.json());
    }
  };

  const updateUserRole = async (id, newRole) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  const removeUser = async (id) => {
    const token = localStorage.getItem('token');
    if (confirm('Are you sure you want to remove this user?')) {
      await fetch(`http://localhost:4000/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newEvent)
    });

    if (res.ok) {
      setMsg('Event added successfully!');
      setNewEvent({ title: '', description: '', date: '' });
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading || !user || user.role !== 'ADMIN') return <p>Loading...</p>;

  // Filter users
  const pendingUsers = users.filter(u => u.role === 'USER');
  const activeMembers = users.filter(u => u.role === 'MEMBER' || u.role === 'ADMIN');

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        
        {/* Manage Members Column */}
        <div>
          {/* Pending Approvals */}
          {pendingUsers.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem', borderColor: 'var(--primary)' }}>
              <h2 style={{ color: 'var(--primary-light)' }}>Pending Approvals</h2>
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>
                        <button 
                          onClick={() => updateUserRole(u.id, 'MEMBER')}
                          className="btn"
                          style={{ marginRight: '10px' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => removeUser(u.id)}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Active Members */}
          <div className="card">
            <h2>Active Members</h2>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeMembers.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td><span className="badge">{u.role}</span></td>
                    <td>
                      {u.role !== 'ADMIN' && (
                        <button 
                          onClick={() => updateUserRole(u.id, 'ADMIN')}
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.7rem', padding: '4px 8px', marginRight: '5px' }}
                        >
                          Make Admin
                        </button>
                      )}
                      {u.id !== user.id && (
                        <button 
                           onClick={() => removeUser(u.id)}
                           className="btn btn-danger"
                           style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Event Column */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h2>Add Event</h2>
            {msg && <p style={{ color: 'var(--success)' }}>{msg}</p>}
            <form onSubmit={handleAddEvent} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input"
                  rows="4"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Add Event</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
