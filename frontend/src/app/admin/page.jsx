"use client";
import { useEffect, useState } from "react";
import fetcher from "../../lib/fetcher";
import Link from "next/link";

export default function AdminHome() {
  const [stats, setStats] = useState({ events: 0, members: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetcher("/api/admin/stats");
        setStats({
          events: res.events ?? 0,
          members: res.members ?? 0,
          pending: res.pending ?? 0
        });
      } catch (err) {
        console.error("admin stats err", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <h1>Admin Dashboard</h1>
      {loading ? <div>Loading…</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <div className="card"><h3>Events</h3><div style={{ fontSize: 28 }}>{stats.events}</div><Link href="/admin/events">Manage</Link></div>
          <div className="card"><h3>Members</h3><div style={{ fontSize: 28 }}>{stats.members}</div><div>Pending: {stats.pending}</div><Link href="/admin/members">Manage</Link></div>
          <div className="card"><h3>Quick Actions</h3><div style={{ display: "flex", gap: 8 }}><Link href="/admin/events"><button className="btn">New Event</button></Link></div></div>
        </div>
      )}
    </section>
  );
}
