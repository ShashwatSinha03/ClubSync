// frontend/src/app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "../../lib/fetcher";
import { useSession } from "../../context/SessionContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setUser } = useSession();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const res = await fetcher("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Immediately set session so Navbar updates (no waiting for /api/auth/me)
      setUser(res?.user ?? res);

      setMessage("Login successful — redirecting...");
      // small delay so cookie is set before navigation
      setTimeout(() => router.push("/dashboard"), 600);
    } catch (err) {
      if (err.status === 401) setMessage("Invalid credentials.");
      else if (err.status === 403) setMessage("Account not approved by admin yet.");
      else setMessage(err.message || "Login failed. Check backend.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, marginTop: 28 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Login</h2>

        <form onSubmit={submit} className="col">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <input
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" disabled={busy}>
              {busy ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              className="btn"
              style={{ background: "var(--surface)", color: "var(--text-primary)" }}
              onClick={() => router.push("/signup")}
            >
              Signup
            </button>
          </div>

          {message && (
            <p style={{ marginTop: 8, color: message.includes("successful") ? "var(--success)" : "var(--danger)" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
