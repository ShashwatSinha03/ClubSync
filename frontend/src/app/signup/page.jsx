"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "../../lib/fetcher";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const res = await fetcher("/api/auth/signup", {
        method: "POST",
        body: { name, email, password },
      });

      setMessage("Signup successful — pending admin approval.");
      // after short delay redirect to login
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setMessage(err.message || "Signup failed. Check backend logs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, marginTop: 28 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Signup</h2>

        <form onSubmit={submit} className="col">
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="Password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            type="password"
          />

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" disabled={busy}>
              {busy ? "Signing up..." : "Signup"}
            </button>

            <button
              type="button"
              className="btn"
              style={{ background: "var(--surface)", color: "var(--text-primary)" }}
              onClick={() => router.push("/login")}
            >
              Back to login
            </button>
          </div>

          {message && <p style={{ marginTop: 8, color: "var(--text-secondary)" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
