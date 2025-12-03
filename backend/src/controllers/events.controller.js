import prisma from "../lib/prisma.js";

// CREATE EVENT (ADMIN ONLY)
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        createdBy: req.user.userId,
      },
    });

    return res.status(201).json({ message: "Event created", event });
  } catch (err) {
    next(err);
  }
};

// GET ALL EVENTS (PUBLIC / MEMBERS)
export const getAllEvents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "date",
      order = "asc",
      upcoming,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    let filter = {};
    if (upcoming === "true") filter.date = { gte: new Date() };

    const events = await prisma.event.findMany({
      skip,
      take: Number(limit),
      orderBy: { [sort]: order },
      where: filter,
    });

    return res.json({ events });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE EVENT
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) return res.status(404).json({ message: "Event not found" });

    return res.json({ event });
  } catch (err) {
    next(err);
  }
};

// UPDATE EVENT (ADMIN ONLY)
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await prisma.event.update({
      where: { id },
      data: req.body,
    });

    return res.json({ message: "Event updated", updated });
  } catch (err) {
    next(err);
  }
};

// DELETE EVENT (ADMIN ONLY)
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({ where: { id } });

    return res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};
