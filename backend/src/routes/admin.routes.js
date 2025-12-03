// backend/src/routes/admin.routes.js
import express from "express";
import prisma from "../lib/prisma.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/**
 * GET /api/admin/stats
 * returns counts for dashboard
 */
router.get("/stats", verifyAccessToken, verifyAdmin, async (req, res, next) => {
  try {
    const [eventsCount, membersCount, pendingMembers] = await Promise.all([
      prisma.event.count(),
      prisma.user.count(),
      prisma.user.count({ where: { approved: false } }),
    ]);

    return res.json({ events: eventsCount, members: membersCount, pending: pendingMembers });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/members
 * Query params: page, limit, search, role, approved
 */
router.get("/members", verifyAccessToken, verifyAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "", role, approved } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;
    if (approved !== undefined) where.approved = approved === "true";

    const [total, members] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, approved: true, createdAt: true },
      }),
    ]);

    return res.json({ total, page: Number(page), limit: Number(limit), members });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/members/:id/approve
 * Approve a member
 */
router.post("/members/:id/approve", verifyAccessToken, verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { approved: true, role: "member" }, // keep role as member by default
      select: { id: true, name: true, email: true, approved: true, role: true },
    });
    return res.json({ message: "Approved", user });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/members/:id/role
 * body: { role: "admin" | "member" }
 * Promote/demote
 */
router.patch("/members/:id/role", verifyAccessToken, verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "role required" });
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, approved: true },
    });
    return res.json({ message: "Role updated", user });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/members/:id
 * Remove a member
 */
router.delete("/members/:id", verifyAccessToken, verifyAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    return res.json({ message: "Member deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
