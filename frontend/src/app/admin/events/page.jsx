"use client";
import { useEffect, useState } from "react";
import fetcher from "../../../lib/fetcher";
import EventCard from "../../../components/events/EventCard";
import EventForm from "../../../components/events/EventForm";
import Paginator from "../../../components/ui/Paginator";

export default function AdminEvents() {
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetcher(`/api/events?page=${page}&limit=${limit}&sort=date&order=asc`);
      // debug log the full response to help diagnose shape issues
      console.debug("AdminEvents.load() response:", res);
      // handle both shapes: { events: [...] } or direct array
      if (res && Array.isArray(res)) {
        setItems(res);
        setTotal(res.length);
      } else {
        setItems(res.events || []);
        setTotal(res.total || (res.events ? res.events.length : 0));
      }
    } catch (err) {
      console.error("AdminEvents.load() error:", err);
      // keep items as-is and show friendly UI
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onCreate = () => { setEditing(null); setShowForm(true); };
  const onEdit = (ev) => { setEditing(ev); setShowForm(true); };
  const onCancel = () => { setEditing(null); setShowForm(false); };

  const onSave = async (payload) => {
    setBusy(true);
    try {
      if (editing) {
        await fetcher(`/api/events/${editing.id}`, { method: "PATCH", body: payload });
      } else {
        await fetcher(`/api/events`, { method: "POST", body: payload });
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      // show nicer message if available
      alert(err?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetcher(`/api/events/${id}`, { method: "DELETE" });
      // if current page becomes empty after delete, move one page back (if possible)
      const remainingOnPage = items.length - 1;
      if (remainingOnPage <= 0 && page > 1) {
        setPage(page - 1);
        // load() will be called by useEffect when page changes
      } else {
        await load();
      }
    } catch (err) {
      alert(err?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Manage Events</h2>
        <div>
          <button className="btn" onClick={onCreate}>New Event</button>
        </div>
      </div>

      {showForm && (
        <div style={{ marginTop:12 }} className="card">
          <EventForm initial={editing || {}} onCancel={onCancel} onSave={onSave} busy={busy} />
        </div>
      )}

      <div style={{ marginTop:12 }}>
        <div className="card">
          {loading ? (
            <div style={{ padding: 20 }}>Loading…</div>
          ) : (
            (() => {
              // Defensive rendering + helpful console warnings for debugging
              if (!items) {
                console.warn("AdminEvents: items is falsy:", items);
                return <div style={{ padding: 18, color: "var(--text-secondary)" }}>No events (items missing)</div>;
              }
              if (!Array.isArray(items)) {
                console.warn("AdminEvents: items is not an array:", items);
                // try to handle shape { events: [...] }
                if (items.events && Array.isArray(items.events)) {
                  return items.events.length ? items.events.map((ev, idx) => {
                    const key = ev?.id ?? ev?._id ?? `ev-${idx}`;
                    return <EventCard key={key} ev={ev} isAdmin onEdit={onEdit} onDelete={onDelete} />;
                  }) : <div style={{ padding: 18, color: "var(--text-secondary)" }}>No events yet</div>;
                }
                return <div style={{ padding: 18, color: "var(--text-secondary)" }}>Invalid events response</div>;
              }

              if (items.length === 0) {
                return <div style={{ padding: 18, color: "var(--text-secondary)" }}>No events yet</div>;
              }

              return items.map((ev, idx) => {
                // guard against missing id; prefer ev.id, fallback to ev._id or index
                const key = ev?.id ?? ev?._id ?? `ev-${idx}`;
                return <EventCard key={key} ev={ev} isAdmin onEdit={onEdit} onDelete={onDelete} />;
              });
            })()
          )}
        </div>

        <Paginator page={page} limit={limit} total={total} onPage={(p) => setPage(p)} />
      </div>
    </div>
  );
}
