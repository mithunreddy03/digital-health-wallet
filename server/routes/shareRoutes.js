const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AccessGrant = require('../models/AccessGrant');
const Report = require('../models/Report');
const auth = require('../middleware/authMiddleware');

// Share access with another user (by email)
router.post('/grant', auth, async (req, res) => {
    try {
        const { email } = req.body;
        const viewer = await User.findOne({ where: { email } });
        if (!viewer) return res.status(404).json({ message: 'User not found' });

        if (viewer.id === req.user.id) return res.status(400).json({ message: 'Cannot share with yourself' });

        const [grant, created] = await AccessGrant.findOrCreate({
            where: { ownerId: req.user.id, viewerId: viewer.id }
        });

        res.json({ message: 'Access granted', grant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reports shared with me
router.get('/shared-with-me', auth, async (req, res) => {
    try {
        const grants = await AccessGrant.findAll({ where: { viewerId: req.user.id } });
        const ownerIds = grants.map(g => g.ownerId);

        const reports = await Report.findAll({
            where: { userId: ownerIds },
            include: [{ model: User, attributes: ['name', 'email'] }], // Include owner info
            order: [['date', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
