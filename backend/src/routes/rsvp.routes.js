// backend/src/routes/rsvp.routes.js
import express from "express";
import {
  createOrToggleRsvp,
  myRsvps,
  listRsvps,
  updateRsvp,
  deleteRsvp,
} from "../controllers/rsvp.controller.js";

import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// user creates or toggles
router.post("/", verifyAccessToken, createOrToggleRsvp);

// user sees their RSVPs
router.get("/me", verifyAccessToken, myRsvps);

// list RSVPs (optionally filtered by eventId) - public read supported, admin gets full info
router.get("/", listRsvps);

// admin updates (attendance)
router.patch("/:id", verifyAccessToken, verifyAdmin, updateRsvp);

// delete (owner or admin)
router.delete("/:id", verifyAccessToken, deleteRsvp);

export default router;
