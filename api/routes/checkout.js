const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const { createCheckout, getCheckoutById } = require('../controllers/checkout.controller');

const router = express.Router();

router.post('/', authMiddleware, createCheckout);
router.get('/:id', authMiddleware, getCheckoutById);

module.exports = router;
