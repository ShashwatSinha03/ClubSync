// backend/src/controllers/rsvp.controller.js
import prisma from "../lib/prisma.js";

/**
 * POST /api/rsvp
 * body: { eventId: string, going?: boolean }  (going default true)
 * Creates an RSVP record or updates existing user's RSVP for an event.
 */
export const createOrToggleRsvp = async (req, res, next) => {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { eventId, going = true } = req.body || {};
    if (!eventId) return res.status(400).json({ message: "eventId required" });

    // Ensure event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Try to find an existing RSVP
    const existing = await prisma.rsvp.findFirst({
      where: { userId, eventId },
    });

    if (existing) {
      // update status (e.g., toggle going)
      const updated = await prisma.rsvp.update({
        where: { id: existing.id },
        data: { going, updatedAt: new Date() },
      });
      return res.json({ message: "RSVP updated", rsvp: updated });
    } else {
      // create
      const rsvp = await prisma.rsvp.create({
        data: {
          userId,
          eventId,
          going,
          createdAt: new Date(),
        },
      });
      return res.status(201).json({ message: "RSVP created", rsvp });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/rsvp/me
 * returns the RSVPs for the logged-in user
 */
export const myRsvps = async (req, res, next) => {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const rsvps = await prisma.rsvp.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { event: true },
    });

    return res.json({ rsvps });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/rsvp
 * query: eventId, page, limit
 * If eventId provided, returns RSVPs for that event (admins + public counts).
 */
export const listRsvps = async (req, res, next) => {
  try {
    const { eventId, page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (eventId) where.eventId = eventId;

    const [total, rsvps] = await Promise.all([
      prisma.rsvp.count({ where }),
      prisma.rsvp.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } }, event: true },
      }),
    ]);

    return res.json({ total, page: Number(page), limit: Number(limit), rsvps });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/rsvp/:id
 * admin can mark attended/present or modify going
 * body: { attended?: boolean, going?: boolean }
 */
export const updateRsvp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { attended, going } = req.body || {};
    if (!id) return res.status(400).json({ message: "id required" });

    const exists = await prisma.rsvp.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: "RSVP not found" });

    const data = {};
    if (typeof attended !== "undefined") data.attended = attended;
    if (typeof going !== "undefined") data.going = going;
    data.updatedAt = new Date();

    const updated = await prisma.rsvp.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, email: true } }, event: true },
    });

    return res.json({ message: "RSVP updated", rsvp: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/rsvp/:id
 * user can cancel their RSVP; admin can delete any
 */
export const deleteRsvp = async (req, res, next) => {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id required" });

    const rsvp = await prisma.rsvp.findUnique({ where: { id } });
    if (!rsvp) return res.status(404).json({ message: "RSVP not found" });

    // allow delete if admin or owner
    if (req.user.role !== "admin" && rsvp.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.rsvp.delete({ where: { id } });
    return res.json({ message: "RSVP deleted" });
  } catch (err) {
    next(err);
  }
};
