// frontend/src/components/events/RSVPButton.jsx
"use client";
import { useEffect, useState } from "react";
import fetcher from "../../lib/fetcher";
import { useSession } from "../../context/SessionContext";

export default function RSVPButton({ eventId, initialGoing = false, onChange }) {
  const { user } = useSession();
  const [going, setGoing] = useState(initialGoing);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { setGoing(initialGoing); }, [initialGoing]);

  const toggle = async () => {
    if (!user) return (window.location.href = "/login");
    setBusy(true);
    setMessage("");
    try {
      const res = await fetcher("/api/rsvp", { method: "POST", body: { eventId, going: !going } });
      setGoing(res.rsvp?.going ?? !going);
      onChange?.(res.rsvp ?? res);
    } catch (err) {
      setMessage(err.message || "RSVP failed");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <button className="btn" onClick={toggle} disabled={busy}>
        {busy ? "Saving…" : (going ? "Cancel RSVP" : "RSVP")}
      </button>
      {message && <div style={{ color: "var(--danger)", marginTop: 8 }}>{message}</div>}
    </div>
  );
}
