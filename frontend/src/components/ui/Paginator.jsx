"use client";
import React from "react";
import styles from "./Paginator.module.css";

export default function Paginator({ page, limit, total, onPage }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  return (
    <div className={styles.root} style={{ display: "flex", gap:8, alignItems:"center", justifyContent:"center", padding:12 }}>
      <button className="btn" disabled={page <= 1} onClick={()=>onPage(page-1)}>Prev</button>
      <div style={{ padding:"6px 10px" }}>{page} / {totalPages}</div>
      <button className="btn" disabled={page >= totalPages} onClick={()=>onPage(page+1)}>Next</button>
    </div>
  );
}
