// frontend/src/components/ProfileMenu.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import fetcher from "../lib/fetcher";
import { useSession } from "../context/SessionContext";

export default function ProfileMenu({ user: propUser }) {
  // Accept user prop but also sync with context for logout convenience
  const { setUser } = useSession();
  const user = propUser;
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [notifCount, setNotifCount] = useState(0);
  const [attendancePct, setAttendancePct] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // notifications (defensive)
      try {
        const n = await fetcher("/api/notifications?limit=5").catch(() => null);
        let count = 0;
        if (n) {
          if (Array.isArray(n)) count = n.length;
          else if (typeof n === "object") {
            if (typeof n.total === "number") count = n.total;
            else if (Array.isArray(n.notifications)) count = n.notifications.length;
            else if (Array.isArray(n.data)) count = n.data.length;
          }
        }
        setNotifCount(count);
      } catch {
        setNotifCount(0);
      }

      // attendance (best-effort)
      try {
        const r = await fetcher("/api/rsvp/me").catch(() => null);
        const rsvps = r?.rsvps ?? (Array.isArray(r) ? r : null);

        const eventsRes = await fetcher("/api/events?page=1&limit=1").catch(() => null);
        const total = eventsRes?.total ?? (eventsRes?.events ? eventsRes.events.length : null);

        if (Array.isArray(rsvps) && total) {
          const going = rsvps.filter(x => x?.going || x?.attended || x?.present).length;
          setAttendancePct(Math.round((going / Math.max(1, total)) * 100));
        } else if (Array.isArray(rsvps)) {
          const going = rsvps.filter(x => x?.going || x?.attended || x?.present).length;
          setAttendancePct(`${going} RSVPs`);
        } else {
          setAttendancePct(null);
        }
      } catch {
        setAttendancePct(null);
      }
    })();
  }, [user]);

  const logout = async () => {
    setBusy(true);
    try {
      await fetcher("/api/auth/logout", { method: "POST" });
    } catch {}
    setBusy(false);
    setUser(null); // clear session in context
    window.location.href = "/login";
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button className="btn" onClick={() => setOpen(o => !o)} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={avatarStyle}>{(user?.name || user?.email || "?")[0]?.toUpperCase()}</div>
        <div style={{ fontSize: 14 }}>{user?.name ?? user?.email}</div>
        {notifCount > 0 && <div style={notifBadge}>{notifCount}</div>}
      </button>

      {open && (
        <div style={menuStyle}>
          <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700 }}>{user?.name ?? user?.email}</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>{user?.email}</div>
            <div style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 13 }}>Role: {user?.role ?? "member"}</div>
          </div>

          <div style={{ padding: 12 }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Attendance</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>{attendancePct === null ? "N/A" : (typeof attendancePct === "number" ? `${attendancePct}%` : attendancePct)}</div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Notifications</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>{notifCount} new</div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="btn" onClick={() => (window.location.href = "/profile")}>Profile</button>
              <button className="btn" style={{ background: "transparent", color: "var(--danger)", border: "1px solid var(--border)" }} onClick={logout} disabled={busy}>
                {busy ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* styles */
const avatarStyle = {
  width: 34, height: 34, borderRadius: 999, display: "inline-flex",
  alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, rgba(96,22,21,0.12), rgba(96,22,21,0.06))",
  color: "var(--primary)", fontWeight: 700
};
const menuStyle = {
  position: "absolute", right: 0, top: "calc(100% + 8px)", width: 280,
  background: "var(--surface)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", borderRadius: 10, zIndex: 60, overflow: "hidden"
};
const notifBadge = { marginLeft: 6, background: "var(--danger)", color: "#fff", borderRadius: 8, padding: "2px 6px", fontSize: 12 };
