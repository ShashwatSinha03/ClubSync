"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "../../../lib/fetcher";

export default function EventView() {
  const params = useParams();
  const id = params.id;
  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try {
        const res = await fetcher(`/api/events/${id}`);
        setEv(res.event || res);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!ev) return <div style={{color:"var(--text-secondary)"}}>Event not found.</div>;

  return (
    <div className="card">
      <h2>{ev.title}</h2>
      <p style={{ color:"var(--text-secondary)" }}>{new Date(ev.date).toLocaleString()}</p>
      <div style={{ marginTop:12 }}>{ev.description}</div>
      <div style={{ marginTop:10, color:"var(--text-secondary)" }}>Location: {ev.location || "TBA"}</div>
    </div>
  );
}
