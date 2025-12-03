"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "../lib/fetcher";

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await fetcher("/api/auth/me");
        setOk(true);
      } catch {
        setOk(false);
        router.push("/(auth)/login");
      }
    })();
  }, []);

  if (ok === null) return <p>Checking authentication...</p>;
  if (!ok) return null;
  return children;
}
