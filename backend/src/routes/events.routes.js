import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/events.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// PUBLIC / MEMBER ROUTES
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// ADMIN-ONLY ROUTES
router.post("/", verifyAccessToken, verifyAdmin, createEvent);
router.patch("/:id", verifyAccessToken, verifyAdmin, updateEvent);
router.delete("/:id", verifyAccessToken, verifyAdmin, deleteEvent);

export default router;
