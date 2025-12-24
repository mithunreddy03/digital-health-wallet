const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const AccessGrant = require('../models/AccessGrant');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

// Upload Report
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, type, date, metadata } = req.body;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const report = await Report.create({
            userId: req.user.id,
            title,
            type,
            filePath: req.file.path,
            date,
            metadata: metadata ? JSON.parse(metadata) : null
        });
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List My Reports (with optional filters)
router.get('/', auth, async (req, res) => {
    try {
        const { type, startDate, endDate, search } = req.query;
        const { Op } = require('sequelize');

        // Build where clause
        const whereClause = { userId: req.user.id };

        if (type) {
            whereClause.type = type;
        }

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = startDate;
            if (endDate) whereClause.date[Op.lte] = endDate;
        }

        if (search) {
            whereClause.title = { [Op.like]: `%${search}%` };
        }

        const reports = await Report.findAll({
            where: whereClause,
            order: [['date', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download/View Report (handles permission check)
router.get('/:id/file', auth, async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Check ownership or shared access
        let hasAccess = report.userId === req.user.id;
        if (!hasAccess) {
            const grant = await AccessGrant.findOne({
                where: {
                    ownerId: report.userId,
                    viewerId: req.user.id,
                    reportId: report.id
                }
            });
            if (grant) hasAccess = true;
        }

        if (!hasAccess) return res.status(403).json({ message: 'Access denied' });

        const absolutePath = path.resolve(report.filePath);
        if (fs.existsSync(absolutePath)) {
            res.sendFile(absolutePath);
        } else {
            res.status(404).json({ message: 'File not found on server' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
