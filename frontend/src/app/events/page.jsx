"use client";
import { useEffect, useState } from "react";
import fetcher from "../../lib/fetcher";
import EventCard from "../../components/events/EventCard";
import Paginator from "../../components/ui/Paginator";
import styles from "../../components/events/EventList.module.css";

export default function EventsPage() {
  const [q, setQ] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("page", page);
      qs.set("limit", limit);
      if (q) qs.set("search", q);
      qs.set("upcoming", upcomingOnly ? "true" : "false");
      qs.set("sort", sort);
      qs.set("order", order);

      const res = await fetcher(`/api/events?${qs.toString()}`);
      setItems(res.events || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed loading events", err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, [page, sort, order, upcomingOnly]);

  return (
    <section>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <h2>Events</h2>
        <div style={{ display:"flex", gap:8 }}>
          <input className="input" placeholder="Search events" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" onClick={() => { setPage(1); load(); }}>Search</button>
        </div>
      </div>

      <div className={styles.controls}>
        <label style={{ display:"flex", alignItems:"center", gap:8 }}>
          <input type="checkbox" checked={upcomingOnly} onChange={e=>{ setUpcomingOnly(e.target.checked); setPage(1); }} /> Upcoming only
        </label>

        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>

        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div className={styles.listRoot}>
        {loading ? <div style={{padding:20}}>Loading…</div> : (
          items.length ? items.map(ev => (
            <EventCard key={ev.id} ev={ev} />
          )) : <div style={{padding:20, color:"var(--text-secondary)"}}>No events found.</div>
        )}
      </div>

      <Paginator page={page} limit={limit} total={total} onPage={(p)=>{ setPage(p); }} />
    </section>
  );
}
