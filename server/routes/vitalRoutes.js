const express = require('express');
const router = express.Router();
const Vital = require('../models/Vital');
const auth = require('../middleware/authMiddleware');

// Add Vital
router.post('/', auth, async (req, res) => {
    try {
        const { type, value, unit, date } = req.body;
        const vital = await Vital.create({
            userId: req.user.id,
            type,
            value,
            unit,
            date
        });
        res.status(201).json(vital);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Vitals (can be filtered by date range in query if needed, basic implementation first)
router.get('/', auth, async (req, res) => {
    try {
        const vitals = await Vital.findAll({ where: { userId: req.user.id }, order: [['date', 'ASC']] }); // ASC for charts
        res.json(vitals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
