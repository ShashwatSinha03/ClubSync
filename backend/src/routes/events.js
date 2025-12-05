const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, isMember, isAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all events (Member only) - with Pagination, Search, Sort
router.get('/', auth, isMember, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sort = req.query.sort === 'desc' ? 'desc' : 'asc';

    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: sort },
      }),
      prisma.event.count({ where }),
    ]);

    res.json({
      events,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
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
