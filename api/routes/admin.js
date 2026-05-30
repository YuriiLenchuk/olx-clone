const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    getAdminStats,
    getAdminItems,
    getAdminUsers,
    updateUserRoles,
    updateUserBlock,
    archiveAdminItem,
    restoreAdminItem,
} = require('../controllers/admin.controller');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', getAdminStats);
router.get('/items', getAdminItems);
router.get('/users', getAdminUsers);

router.patch('/users/:id/roles', updateUserRoles);
router.patch('/users/:id/block', updateUserBlock);

router.patch('/items/:id/archive', archiveAdminItem);
router.patch('/items/:id/restore', restoreAdminItem);

module.exports = router;