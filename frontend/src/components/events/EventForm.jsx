"use client";
import { useState, useEffect } from "react";

export default function EventForm({ initial = {}, onCancel, onSave, busy }) {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [date, setDate] = useState(initial.date ? new Date(initial.date).toISOString().slice(0,16) : "");
  const [location, setLocation] = useState(initial.location || "");

  useEffect(() => {
    setTitle(initial.title || "");
    setDescription(initial.description || "");
    setDate(initial.date ? new Date(initial.date).toISOString().slice(0,16) : "");
    setLocation(initial.location || "");
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      description: description.trim(),
      date: date ? new Date(date).toISOString() : null,
      location: location.trim() || null,
    };
    onSave(payload);
  };

  return (
    <form onSubmit={submit} className="col" style={{ gap: 10 }}>
      <input className="input" required placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="input" rows={5} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <label style={{fontSize:12, color:"var(--text-secondary)"}}>Date & time</label>
      <input className="input" type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} />
      <input className="input" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      <div style={{ display:"flex", gap:8 }}>
        <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
        <button type="button" className="btn" style={{ background:"var(--surface)", color:"var(--text-primary)" }} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
