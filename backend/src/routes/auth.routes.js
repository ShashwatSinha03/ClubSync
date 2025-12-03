// backend/src/routes/auth.routes.js
import express from "express";
import { signup, login, logout, me } from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.post("/signup", signup);
router.post("/login", login);

// Auth-required
router.post("/logout", verifyAccessToken, logout); // optional: allow logout only if logged in
router.get("/me", verifyAccessToken, me);

export default router;
