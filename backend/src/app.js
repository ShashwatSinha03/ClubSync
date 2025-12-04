import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  // add your production origin(s) here, e.g. "https://app.example.com"
];

app.use(express.json());

// Reusable origin checker
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // not allowed — send a clear message to server logs and return false
    console.warn("Blocked CORS request from:", origin);
    return callback(new Error("CORS_NOT_ALLOWED"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
};

// Use the CORS middleware for all routes
app.use((req, res, next) => {
  cors(corsOptions)(req, res, (err) => {
    if (err) {
      // For preflight or normal requests, respond with 403 and a clear body
      res.status(403).json({ error: "CORS not allowed", details: err.message });
      return;
    }
    next();
  });
});

// Explicitly handle OPTIONS preflight quickly for all routes
app.options("*", cors(corsOptions));

// ... your routes here
// app.use("/app/auth", authRouter)

export default app;
