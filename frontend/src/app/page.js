"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "../lib/fetcher";
import styles from "../components/UI.module.css";
import { motion } from "framer-motion";
import ThreeBG from "../components/ThreeBG";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth; redirect if logged in
    (async () => {
      try {
        await fetcher("/api/auth/me");
        router.replace("/dashboard"); // user logged in -> dashboard
      } catch {
        setLoading(false); // not logged in -> show landing
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div style={{minHeight: "60vh"}} className="container">
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>
          <div>Checking session…</div>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.heroWrap}>
      <ThreeBG />
      <div className={styles.heroInner + " container"}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.heroCard}
        >
          <h1 className={styles.title}>ClubSync</h1>
          <p className={styles.lead}>
            Clean, modern club event management — plan events, track attendance and approve members with ease.
          </p>

          <div style={{display:"flex", gap:12, marginTop:18}}>
            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="/login">
              <button className="btn">Login</button>
            </motion.a>

            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="/signup">
              <button className="btn" style={{ background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
                Signup
              </button>
            </motion.a>
          </div>

          <div style={{ marginTop: 18, color: "var(--text-secondary)" }}>
            <small>Already part of a club? Sign in to access your dashboard.</small>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
