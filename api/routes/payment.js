const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const {
    createPayment,
    simulatePayment,
    confirm3DS,
    getMyPayments,
} = require('../controllers/paymen.controller');

const router = express.Router();

router.get('/my', authMiddleware, getMyPayments);

router.post('/', authMiddleware, createPayment);
router.post('/:id/simulate', authMiddleware, simulatePayment);
router.post('/:id/confirm-3ds', authMiddleware, confirm3DS);

module.exports = router;
