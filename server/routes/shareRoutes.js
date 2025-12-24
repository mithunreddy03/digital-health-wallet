const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AccessGrant = require('../models/AccessGrant');
const Report = require('../models/Report');
const auth = require('../middleware/authMiddleware');

// Share specific reports with another user (by email)
router.post('/grant', auth, async (req, res) => {
    try {
        const { email, reportIds } = req.body;

        if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
            return res.status(400).json({ message: 'Please select at least one report to share' });
        }

        const viewer = await User.findOne({ where: { email } });
        if (!viewer) return res.status(404).json({ message: 'User not found' });

        if (viewer.id === req.user.id) return res.status(400).json({ message: 'Cannot share with yourself' });

        // Verify all reports belong to the user
        const reports = await Report.findAll({
            where: { id: reportIds, userId: req.user.id }
        });

        if (reports.length !== reportIds.length) {
            return res.status(403).json({ message: 'Some reports do not belong to you' });
        }

        // Create grants for each report
        const grants = [];
        for (const reportId of reportIds) {
            const [grant, created] = await AccessGrant.findOrCreate({
                where: { ownerId: req.user.id, viewerId: viewer.id, reportId }
            });
            grants.push(grant);
        }

        res.json({ message: 'Access granted successfully', count: grants.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all my active grants (who I've shared with)
router.get('/grants', auth, async (req, res) => {
    try {
        const grants = await AccessGrant.findAll({
            where: { ownerId: req.user.id },
            include: [
                { model: User, as: 'SharedWithMe', attributes: ['id', 'name', 'email'] }
            ]
        });

        // Group by viewer
        const grouped = {};
        for (const grant of grants) {
            const viewerId = grant.viewerId;
            if (!grouped[viewerId]) {
                grouped[viewerId] = {
                    viewer: grant.SharedWithMe,
                    reportIds: [],
                    grantIds: []
                };
            }
            grouped[viewerId].reportIds.push(grant.reportId);
            grouped[viewerId].grantIds.push(grant.id);
        }

        res.json(Object.values(grouped));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Revoke access to a specific report
router.delete('/revoke/:grantId', auth, async (req, res) => {
    try {
        const grant = await AccessGrant.findByPk(req.params.grantId);
        if (!grant) return res.status(404).json({ message: 'Grant not found' });

        if (grant.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await grant.destroy();
        res.json({ message: 'Access revoked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reports shared with me
router.get('/shared-with-me', auth, async (req, res) => {
    try {
        const grants = await AccessGrant.findAll({
            where: { viewerId: req.user.id },
            include: [
                { model: User, as: 'SharedWithOthers', attributes: ['name', 'email'] }
            ]
        });

        const reportIds = grants.map(g => g.reportId);

        const reports = await Report.findAll({
            where: { id: reportIds },
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['date', 'DESC']]
        });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
