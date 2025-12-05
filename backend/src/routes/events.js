const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, isMember, isAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all events (Member only)
router.get('/', auth, isMember, async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date)
      }
    });
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
