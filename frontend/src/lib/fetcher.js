// frontend/src/lib/fetcher.js
const API = process.env.NEXT_PUBLIC_API_URL;

export default async function fetcher(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;

  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {})
    },
    ...opts
  };

  if (opts.body) config.body = JSON.stringify(opts.body);

  const res = await fetch(url, config);

  if (res.status === 401) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}
