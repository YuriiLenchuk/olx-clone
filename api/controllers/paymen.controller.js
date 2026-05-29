const Payment = require('../models/payment_model');
const Item = require('../models/item_model');

const detectCardBrand = cardNumber => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    return 'Unknown';
};

const normalizeCardNumber = cardNumber => {
    return String(cardNumber || '').replace(/\D/g, '');
};

const isValidLuhn = cardNumber => {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
        let digit = Number(cardNumber[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

const createPayment = async (req, res) => {
    try {
        const { itemId, method = 'google_pay_simulation' } = req.body;

        if (!itemId) {
            return res.status(400).json({
                message: 'itemId є обовʼязковим',
            });
        }

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({
                message: 'Товар не знайдено',
            });
        }

        if (String(item.owner) === String(req.user.id)) {
            return res.status(400).json({
                message: 'Не можна оплатити власний товар',
            });
        }

        const alreadyPaid = await Payment.findOne({
            item: item._id,
            status: 'paid',
        });

        if (alreadyPaid) {
            return res.status(409).json({
                message: 'Цей товар уже оплачений іншим користувачем',
            });
        }

        const payment = new Payment({
            item: item._id,
            buyer: req.user.id,
            seller: item.owner,
            amount: item.price,
            currency: 'UAH',
            method,
            status: 'pending',
            providerPaymentId: `SIM-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        });

        await payment.save();

        return res.status(201).json({
            message: 'Платіж створено',
            payment,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при створенні платежу',
            error: err.message,
        });
    }
};

const simulatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { cardNumber } = req.body;

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({
                message: 'Платіж не знайдено',
            });
        }

        if (String(payment.buyer) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'Ви можете оплачувати тільки власні платежі',
            });
        }

        if (payment.status === 'paid') {
            return res.status(400).json({
                message: 'Платіж уже оплачено',
            });
        }

        const normalizedCard = normalizeCardNumber(cardNumber);

        if (normalizedCard.length < 12 || normalizedCard.length > 19) {
            payment.status = 'failed';
            payment.failureReason = 'Некоректний номер картки';
            await payment.save();

            return res.status(400).json({
                message: 'Некоректний номер картки',
                payment,
            });
        }

        if (!isValidLuhn(normalizedCard)) {
            payment.status = 'failed';
            payment.failureReason = 'Картка не пройшла Luhn-перевірку';
            await payment.save();

            return res.status(400).json({
                message: 'Картка не пройшла перевірку',
                payment,
            });
        }

        payment.status = 'processing';
        payment.cardInfo = {
            brand: detectCardBrand(normalizedCard),
            last4: normalizedCard.slice(-4),
        };

        if (normalizedCard.endsWith('0000')) {
            payment.status = 'failed';
            payment.failureReason = 'Банк відхилив транзакцію';
            await payment.save();

            return res.status(402).json({
                message: 'Оплату відхилено банком',
                payment,
            });
        }
        
        if (normalizedCard.endsWith('1111')) {
            payment.status = 'requires_action';
            payment.failureReason = null;
            await payment.save();

            return res.status(200).json({
                message: 'Потрібне 3DS-підтвердження',
                requiresAction: true,
                payment,
            });
        }

        payment.status = 'paid';
        payment.failureReason = null;
        payment.paidAt = new Date();

        await payment.save();

        return res.status(200).json({
            message: 'Оплату успішно виконано',
            payment,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при імітації платежу',
            error: err.message,
        });
    }
};

const confirm3DS = async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;

        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({
                message: 'Платіж не знайдено',
            });
        }

        if (String(payment.buyer) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'Ви можете підтверджувати тільки власні платежі',
            });
        }

        if (payment.status !== 'requires_action') {
            return res.status(400).json({
                message: 'Цей платіж не потребує 3DS-підтвердження',
            });
        }

        if (code !== '111111') {
            payment.status = 'failed';
            payment.failureReason = 'Невірний 3DS-код';
            await payment.save();

            return res.status(400).json({
                message: 'Невірний 3DS-код',
                payment,
            });
        }

        payment.status = 'paid';
        payment.failureReason = null;
        payment.paidAt = new Date();

        await payment.save();

        return res.status(200).json({
            message: '3DS підтверджено, оплату виконано',
            payment,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при підтвердженні 3DS',
            error: err.message,
        });
    }
};

const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ buyer: req.user.id })
            .populate({
                path: 'item',
                select: 'name price img location',
            })
            .populate({
                path: 'seller',
                select: '-password -roles -__v',
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            payments,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при отриманні платежів',
            error: err.message,
        });
    }
};

module.exports = {
    createPayment,
    simulatePayment,
    confirm3DS,
    getMyPayments,
};