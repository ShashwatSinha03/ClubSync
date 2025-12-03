// frontend/src/app/events/[id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "../../../lib/fetcher";
import RSVPButton from "../../../components/events/RSVPButton";
import Link from "next/link";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRsvp, setUserRsvp] = useState(null);
  const [attendeesCount, setAttendeesCount] = useState(0);

  useEffect(() => {
    if (!eventId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const ev = await fetcher(`/api/events/${eventId}`);
        if (!mounted) return;
        setEvent(ev.event ?? ev);
      } catch (err) {
        console.error("load event", err);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => (mounted = false);
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        // fetch user rsvp (via /api/rsvp/me) and filter; simpler: call list endpoint
        const list = await fetcher(`/api/rsvp?eventId=${encodeURIComponent(eventId)}`);
        const rsvps = list.rsvps ?? [];
        setAttendeesCount(rsvps.filter(r => r.going || r.attended).length);
        // if logged in, /api/rsvp/me would tell the user's rsvp; but we can try:
        try {
          const mine = await fetcher("/api/rsvp/me");
          const myR = (mine.rsvps || []).find(x => (x.eventId === eventId || x.event?.id === eventId));
          setUserRsvp(myR || null);
        } catch {
          setUserRsvp(null);
        }
      } catch (err) {
        console.warn("rsvp list", err);
      }
    })();
  }, [eventId]);

  if (loading) return <div>Loading…</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <section>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div className="card">
            <h1 style={{ marginTop: 0 }}>{event.name ?? event.title}</h1>
            <div style={{ color: "var(--text-secondary)" }}>{event.description}</div>

            <div style={{ marginTop: 12 }}>
              <strong>Date:</strong> {event.date ? new Date(event.date).toLocaleString() : "TBA"}
            </div>
            <div><strong>Location:</strong> {event.location ?? "TBA"}</div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
              <RSVPButton eventId={eventId} initialGoing={Boolean(userRsvp?.going)} onChange={(r) => setUserRsvp(r)} />
              <div style={{ color: "var(--text-secondary)" }}>{attendeesCount} attendees</div>
              <Link href="/events"><button className="btn">Back to events</button></Link>
            </div>
          </div>
        </div>

        <aside style={{ width: 320 }}>
          <div className="card">Organizer info here (coming soon)</div>
        </aside>
      </div>
    </section>
  );
}
