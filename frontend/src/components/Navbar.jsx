// frontend/src/components/Navbar.jsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { user } = useSession();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // give SessionProvider a moment to hydrate; don't show "Session check failed"
    const t = setTimeout(() => setChecking(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <header style={navStyle}>
      <div style={leftStyle}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <strong style={{ color: "var(--primary)" }}>ClubSync</strong>
        </Link>
        <Link href="/events" style={navLink}>Events</Link>
      </div>

      <div style={rightStyle}>
        {checking && <span style={{ color: "var(--text-secondary)" }}>checking…</span>}

        {!checking && !user && (
          <Link href="/login">
            <button className="btn">Login</button>
          </Link>
        )}

        {!checking && user && (
          <>
            {user.role === "admin" && (
              <Link href="/admin" aria-label="Admin Panel">
                <button className="btn" style={adminBtnStyle}><span style={{ fontSize: 16 }}>⚙️</span></button>
              </Link>
            )}
            <ProfileMenu user={user} />
          </>
        )}
      </div>
    </header>
  );
}

/* styles */
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  borderBottom: "1px solid var(--border)",
  gap: 12,
};
const leftStyle = { display: "flex", gap: 16, alignItems: "center" };
const rightStyle = { display: "flex", gap: 12, alignItems: "center" };
const navLink = { fontSize: 14, color: "var(--text-secondary)", marginLeft: 6, textDecoration: "none" };
const adminBtnStyle = { background: "var(--primary)", color: "#fff", width: 40, height: 40, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center" };
