"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import fetcher from "../lib/fetcher";

const SessionContext = createContext({ user: null, setUser: () => {} });

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetcher("/api/auth/me");
        const u = res?.user ?? res;
        if (u) setUser(u);
      } catch {
        // ignore; login/signup will set user immediately
      }
    })();
  }, []);

  return <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
