const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const {
    getPaymentById,
    payCheckoutWithGooglePay,
    simulateCheckoutCardPayment,
    confirmCheckout3DS,
    cancelCheckoutPayment,
    getMyPayments,
    getMySalesPayments,
} = require('../controllers/payment.controller');

const router = express.Router();

router.get('/my', authMiddleware, getMyPayments);
router.get('/sales', authMiddleware, getMySalesPayments);

router.get('/:id', authMiddleware, getPaymentById);

router.post('/:checkoutId/google-pay', authMiddleware, payCheckoutWithGooglePay);
router.post('/:checkoutId/card-simulation', authMiddleware, simulateCheckoutCardPayment);
router.post('/:checkoutId/confirm-3ds', authMiddleware, confirmCheckout3DS);

router.patch('/:checkoutId/cancel', authMiddleware, cancelCheckoutPayment);

module.exports = router;
