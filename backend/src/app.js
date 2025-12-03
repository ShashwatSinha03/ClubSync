// backend/src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/members.routes.js";
import eventRoutes from "./routes/events.routes.js";
import rsvpRoutes from "./routes/rsvp.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/* --------------------------------------------
   1) SECURITY (Helmet)
--------------------------------------------- */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

/* --------------------------------------------
   2) JSON + URL Parsing
--------------------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --------------------------------------------
   3) Cookies
--------------------------------------------- */
app.use(cookieParser());

/* --------------------------------------------
   4) CORS
--------------------------------------------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

/* --------------------------------------------
   5) Health Check
--------------------------------------------- */
app.get("/", (req, res) => res.send("ClubSync Backend Running"));

/* --------------------------------------------
   6) ROUTES (mount after parsers)
--------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/admin", adminRoutes);

/* --------------------------------------------
   7) GLOBAL ERROR HANDLER
--------------------------------------------- */
app.use(errorHandler);

export default app;
