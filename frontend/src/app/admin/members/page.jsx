"use client";
import { useEffect, useState } from "react";
import fetcher from "../../../lib/fetcher";

export default function AdminMembers() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);

  const loadMe = async () => {
    try {
      const res = await fetcher("/api/auth/me");
      setMe(res?.user ?? res);
    } catch (e) {
      setMe(null);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetcher(`/api/admin/members?page=${page}&limit=${limit}`);
      setMembers(res.members || []);
      setTotal(res.total ?? (res.members ? res.members.length : 0));
      console.debug("AdminMembers.load()", res);
    } catch (err) {
      console.error("Failed to load members", err);
      setMembers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const approve = async (id) => {
    try {
      await fetcher(`/api/admin/members/${id}/approve`, { method: "POST" });
      await load();
      alert("Approved");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Approve failed");
    }
  };

  const changeRole = async (id, role) => {
    if (id === me?.id) { alert("You cannot change your own role."); return; }
    if (!confirm(`Change role to ${role}?`)) return;
    try {
      await fetcher(`/api/admin/members/${id}/role`, { method: "PATCH", body: { role } });
      await load();
      alert("Role updated");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Role update failed");
    }
  };

  const remove = async (id) => {
    if (id === me?.id) { alert("You cannot remove yourself."); return; }
    if (!confirm("Remove member? This cannot be undone.")) return;
    try {
      await fetcher(`/api/admin/members/${id}`, { method: "DELETE" });
      await load();
      alert("Removed");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Remove failed");
    }
  };

  return (
    <section>
      <h2>Members</h2>
      <div style={{ marginTop: 12 }} className="card">
        {loading ? <div style={{ padding: 20 }}>Loading…</div> : (
          members.length ? members.map(m => (
            <div key={m.id || m._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.name || m.email}</div>
                <div style={{ color: "var(--text-secondary)" }}>{m.email}</div>
                <div style={{ color: "var(--text-secondary)" }}>Role: {m.role}</div>
                <div style={{ color: "var(--text-secondary)" }}>Approved: {m.approved ? "Yes" : "No"}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {!m.approved && <button className="btn" onClick={() => approve(m.id || m._id)}>Approve</button>}
                {m.role !== "admin" && <button className="btn" onClick={() => changeRole(m.id || m._id, "admin")}>Promote to Admin</button>}
                {m.role === "admin" && <button className="btn" onClick={() => changeRole(m.id || m._id, "member")}>Demote to Member</button>}
                <button className="btn" style={{ background: "transparent", color: "var(--danger)", border: "1px solid var(--border)" }} onClick={() => remove(m.id || m._id)}>Remove</button>
              </div>
            </div>
          )) : <div style={{ padding: 18, color: "var(--text-secondary)" }}>No members</div>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
        <button className="btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <div style={{ padding: "8px 12px" }}>{page}</div>
        <button className="btn" disabled={members.length < limit} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </section>
  );
}
