// frontend/src/app/admin/events/[id]/attendance/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "../../../../../lib/fetcher";

export default function AdminAttendance() {
  const { id: eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [rsvps, setRsvps] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher(`/api/rsvp?eventId=${encodeURIComponent(eventId)}&limit=200`);
      setRsvps(res.rsvps || []);
    } catch (err) {
      setError(err.message || "Failed");
    } finally { setLoading(false); }
  };

  useEffect(() => { if (eventId) load(); }, [eventId]);

  const mark = async (rsvpId, attended) => {
    try {
      await fetcher(`/api/rsvp/${rsvpId}`, { method: "PATCH", body: { attended } });
      load();
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  return (
    <section>
      <h2>Attendance — Event {eventId}</h2>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: "var(--danger)" }}>{error}</div>}
      {!loading && (
        <div className="card">
          {rsvps.length === 0 ? <div style={{ padding: 12, color: "var(--text-secondary)" }}>No RSVPs</div> : (
            rsvps.map(r => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: 10, borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.user?.name ?? r.user?.email}</div>
                  <div style={{ color: "var(--text-secondary)" }}>{r.user?.email}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ minWidth: 90, textAlign: "center" }}>{r.going ? "RSVP'd" : "No"}</div>
                  <button className="btn" onClick={() => mark(r.id, true)}>Mark Present</button>
                  <button className="btn" style={{ background: "transparent" }} onClick={() => mark(r.id, false)}>Mark Absent</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
