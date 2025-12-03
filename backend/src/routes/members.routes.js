import express from "express";
import {
  getAllMembers,
  approveMember,
  deleteMember,
} from "../controllers/members.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// GET all members
router.get("/", verifyAccessToken, verifyAdmin, getAllMembers);

// APPROVE a member
router.patch("/:id/approve", verifyAccessToken, verifyAdmin, approveMember);

// DELETE a member
router.delete("/:id", verifyAccessToken, verifyAdmin, deleteMember);

export default router;
