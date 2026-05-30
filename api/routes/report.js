const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    createReport,
    getMyReportForItem,
    getAdminReports,
    updateReportStatus,
} = require('../controllers/report.controller');

const router = express.Router();

router.post('/', authMiddleware, createReport);

router.get('/item/:itemId/me', authMiddleware, getMyReportForItem);

router.get('/admin', authMiddleware, adminMiddleware, getAdminReports);

router.patch('/admin/:id', authMiddleware, adminMiddleware, updateReportStatus);

module.exports = router;