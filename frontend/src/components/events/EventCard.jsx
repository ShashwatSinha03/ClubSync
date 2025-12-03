"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function EventCard({ ev, onEdit, onDelete, isAdmin }) {
  const router = useRouter();
  const dateStr = ev.date ? new Date(ev.date).toLocaleString() : "TBA";
  return (
    <div style={{
      display:"flex", gap:12, justifyContent:"space-between",
      padding:16, borderBottom:"1px solid var(--border)", alignItems:"flex-start"
    }}>
      <div style={{flex:1}}>
        <h3 style={{margin:0}}>{ev.title}</h3>
        <div style={{color:"var(--text-secondary)", marginTop:6}}>{ev.description ? ev.description.slice(0,180) + (ev.description.length>180?"…":"") : ""}</div>
        <div style={{marginTop:8, color:"var(--text-secondary)"}}>{dateStr} • {ev.location || "No location"}</div>
      </div>

      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        <button className="btn" onClick={() => router.push(`/events/${ev.id}`)}>Open</button>
        {isAdmin && (
          <>
            <button className="btn" style={{ background: "var(--surface)", color: "var(--text-primary)" }} onClick={() => onEdit && onEdit(ev)}>Edit</button>
            <button className="btn" style={{ background: "transparent", color: "var(--danger)", border: "1px solid var(--border)" }} onClick={() => onDelete && onDelete(ev.id)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
