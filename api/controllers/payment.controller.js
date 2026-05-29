const Payment = require('../models/payment_model');
const Checkout = require('../models/checkout_model');
const Item = require('../models/item_model');

const normalizeCardNumber = cardNumber => {
    return String(cardNumber || '').replace(/\D/g, '');
};

const detectCardBrand = cardNumber => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';

    return 'Unknown';
};

const isValidLuhn = cardNumber => {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
        let digit = Number(cardNumber[i]);

        if (shouldDouble) {
            digit *= 2;

            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

const buildTransactionId = () => {
    return `SIM-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

const delay = ms => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

const populateCheckout = checkoutId => {
    return Checkout.findById(checkoutId)
        .populate({
            path: 'item',
            select: 'name price img location owner description',
        })
        .populate({
            path: 'buyer',
            select: '-password -roles -__v',
        })
        .populate({
            path: 'seller',
            select: '-password -roles -__v',
        })
        .populate({
            path: 'payment',
        });
};

const populatePayment = paymentId => {
    return Payment.findById(paymentId)
        .populate({
            path: 'checkout',
        })
        .populate({
            path: 'item',
            select: 'name price img location owner description',
        })
        .populate({
            path: 'buyer',
            select: '-password -roles -__v',
        })
        .populate({
            path: 'seller',
            select: '-password -roles -__v',
        });
};

const getCheckoutForPayment = async ({ checkoutId, userId, expectedMethod }) => {
    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
        return {
            error: true,
            status: 404,
            message: 'Checkout не знайдено',
        };
    }

    if (String(checkout.buyer) !== String(userId)) {
        return {
            error: true,
            status: 403,
            message: 'Ви можете оплачувати тільки власний checkout',
        };
    }

    if (checkout.paymentStatus === 'paid_test') {
        return {
            error: true,
            status: 400,
            message: 'Checkout уже оплачено',
        };
    }

    if (checkout.checkoutStatus === 'cancelled') {
        return {
            error: true,
            status: 400,
            message: 'Checkout скасовано',
        };
    }

    if (expectedMethod && checkout.paymentMethod !== expectedMethod) {
        return {
            error: true,
            status: 400,
            message: 'Для цього checkout вибрано інший спосіб оплати',
        };
    }

    const alreadyPaidCheckout = await Checkout.findOne({
        item: checkout.item,
        _id: {
            $ne: checkout._id,
        },
        paymentStatus: 'paid_test',
    });

    if (alreadyPaidCheckout) {
        return {
            error: true,
            status: 409,
            message: 'Цей товар уже оплачений іншим користувачем',
        };
    }

    return {
        error: false,
        checkout,
    };
};

const createPaymentAttempt = async ({
    checkout,
    method,
    status = 'processing',
    cardInfo = {},
    googlePayInfo = {},
}) => {
    return Payment.create({
        checkout: checkout._id,
        item: checkout.item,
        buyer: checkout.buyer,
        seller: checkout.seller,
        amount: checkout.totalAmount,
        currency: checkout.currency || 'UAH',
        method,
        status,
        cardInfo,
        googlePayInfo,
        failureReason: null,
    });
};

const markCheckoutAsProcessing = async (checkout, paymentId = null) => {
    checkout.paymentStatus = 'processing';
    checkout.checkoutStatus = 'awaiting_payment';

    if (paymentId) {
        checkout.payment = paymentId;
    }

    await checkout.save();
};

const markPaymentAsFailed = async ({ checkout, payment, reason }) => {
    payment.status = 'failed';
    payment.failureReason = reason;

    await payment.save();

    checkout.paymentStatus = 'failed';
    checkout.checkoutStatus = 'failed';
    checkout.payment = payment._id;

    await checkout.save();

    const populatedCheckout = await populateCheckout(checkout._id);
    const populatedPayment = await populatePayment(payment._id);

    return {
        checkout: populatedCheckout,
        payment: populatedPayment,
    };
};

const markPaymentAsPaid = async ({ checkout, payment }) => {
    payment.status = 'paid_test';
    payment.failureReason = null;
    payment.mockTransactionId = buildTransactionId();
    payment.paidAt = new Date();

    await payment.save();

    checkout.paymentStatus = 'paid_test';
    checkout.checkoutStatus = 'paid';
    checkout.payment = payment._id;
    checkout.paidAt = new Date();

    await checkout.save();

    await archiveItemForCheckout(checkout);

    const populatedCheckout = await populateCheckout(checkout._id);
    const populatedPayment = await populatePayment(payment._id);

    return {
        checkout: populatedCheckout,
        payment: populatedPayment,
    };
};

const archiveItemForCheckout = async checkout => {
    const archivedItem = await Item.findOneAndUpdate(
        {
            _id: checkout.item,
            $or: [
                { isArchived: { $ne: true } },
                { archivedByCheckout: checkout._id },
            ],
        },
        {
            $set: {
                isArchived: true,
                archivedAt: new Date(),
                archivedByCheckout: checkout._id,
            },
        },
        { new: true },
    );

    if (!archivedItem) {
        throw new Error('Цей товар уже недоступний');
    }

    return archivedItem;
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await populatePayment(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: 'Платіж не знайдено',
            });
        }

        const isBuyer = String(payment.buyer._id) === String(req.user.id);
        const isSeller = String(payment.seller._id) === String(req.user.id);

        if (!isBuyer && !isSeller) {
            return res.status(403).json({
                message: 'Немає доступу до цього платежу',
            });
        }

        return res.status(200).json({
            payment,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при отриманні платежу',
            error: err.message,
        });
    }
};

const payCheckoutWithGooglePay = async (req, res) => {
    try {
        const { checkoutId } = req.params;
        const { paymentData } = req.body;

        const result = await getCheckoutForPayment({
            checkoutId,
            userId: req.user.id,
            expectedMethod: 'google_pay_simulation',
        });

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        const { checkout } = result;

        const token = paymentData?.paymentMethodData?.tokenizationData?.token;

        if (!token) {
            return res.status(400).json({
                message: 'Google Pay token відсутній',
            });
        }

        const { paymentMethodData } = paymentData;
        const paymentInfo = paymentMethodData.info || {};

        const payment = await createPaymentAttempt({
            checkout,
            method: 'google_pay_simulation',
            status: 'processing',
            googlePayInfo: {
                cardNetwork: paymentInfo.cardNetwork || null,
                cardDetails: paymentInfo.cardDetails || null,
                description: paymentMethodData.description || 'Google Pay TEST payment',
            },
        });

        await markCheckoutAsProcessing(checkout, payment._id);

        await delay(900);

        const paidResult = await markPaymentAsPaid({
            checkout,
            payment,
        });

        return res.status(200).json({
            message: 'Google Pay оплату успішно імітовано',
            checkout: paidResult.checkout,
            payment: paidResult.payment,
        });
    } catch (err) {
        console.log('Google Pay payment error:', err);

        return res.status(500).json({
            message: 'Помилка при Google Pay оплаті',
            error: err.message,
        });
    }
};

const simulateCheckoutCardPayment = async (req, res) => {
    try {
        const { checkoutId } = req.params;
        const { cardNumber } = req.body;

        const result = await getCheckoutForPayment({
            checkoutId,
            userId: req.user.id,
            expectedMethod: 'card_simulation',
        });

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        const { checkout } = result;

        const normalizedCard = normalizeCardNumber(cardNumber);

        const payment = await createPaymentAttempt({
            checkout,
            method: 'card_simulation',
            status: 'processing',
            cardInfo: {
                brand: detectCardBrand(normalizedCard),
                last4: normalizedCard ? normalizedCard.slice(-4) : null,
            },
        });

        await markCheckoutAsProcessing(checkout, payment._id);

        if (normalizedCard.length < 12 || normalizedCard.length > 19) {
            const failedResult = await markPaymentAsFailed({
                checkout,
                payment,
                reason: 'Некоректний номер картки',
            });

            return res.status(400).json({
                message: 'Некоректний номер картки',
                checkout: failedResult.checkout,
                payment: failedResult.payment,
            });
        }

        if (!isValidLuhn(normalizedCard)) {
            const failedResult = await markPaymentAsFailed({
                checkout,
                payment,
                reason: 'Картка не пройшла Luhn-перевірку',
            });

            return res.status(400).json({
                message: 'Картка не пройшла перевірку',
                checkout: failedResult.checkout,
                payment: failedResult.payment,
            });
        }

        await delay(900);

        if (normalizedCard.endsWith('0000')) {
            const failedResult = await markPaymentAsFailed({
                checkout,
                payment,
                reason: 'Банк відхилив транзакцію',
            });

            return res.status(402).json({
                message: 'Оплату відхилено банком',
                checkout: failedResult.checkout,
                payment: failedResult.payment,
            });
        }

        if (normalizedCard.endsWith('1111')) {
            payment.status = 'requires_action';
            payment.failureReason = null;

            await payment.save();

            checkout.paymentStatus = 'processing';
            checkout.checkoutStatus = 'awaiting_payment';
            checkout.payment = payment._id;

            await checkout.save();

            const populatedCheckout = await populateCheckout(checkout._id);
            const populatedPayment = await populatePayment(payment._id);

            return res.status(200).json({
                message: 'Потрібне 3DS-підтвердження',
                requiresAction: true,
                checkout: populatedCheckout,
                payment: populatedPayment,
            });
        }

        const paidResult = await markPaymentAsPaid({
            checkout,
            payment,
        });

        return res.status(200).json({
            message: 'Оплату карткою успішно імітовано',
            checkout: paidResult.checkout,
            payment: paidResult.payment,
        });
    } catch (err) {
        console.log('Card payment simulation error:', err);

        return res.status(500).json({
            message: 'Помилка при імітації платежу',
            error: err.message,
        });
    }
};

const confirmCheckout3DS = async (req, res) => {
    try {
        const { checkoutId } = req.params;
        const { code } = req.body;

        const result = await getCheckoutForPayment({
            checkoutId,
            userId: req.user.id,
            expectedMethod: 'card_simulation',
        });

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        const { checkout } = result;

        const payment = await Payment.findOne({
            checkout: checkout._id,
            buyer: req.user.id,
            method: 'card_simulation',
            status: 'requires_action',
        }).sort({
            createdAt: -1,
        });

        if (!payment) {
            return res.status(400).json({
                message: 'Цей checkout не потребує 3DS-підтвердження',
            });
        }

        if (code !== '111111') {
            const failedResult = await markPaymentAsFailed({
                checkout,
                payment,
                reason: 'Невірний 3DS-код',
            });

            return res.status(400).json({
                message: 'Невірний 3DS-код',
                checkout: failedResult.checkout,
                payment: failedResult.payment,
            });
        }

        const paidResult = await markPaymentAsPaid({
            checkout,
            payment,
        });

        return res.status(200).json({
            message: '3DS підтверджено, оплату виконано',
            checkout: paidResult.checkout,
            payment: paidResult.payment,
        });
    } catch (err) {
        console.log('3DS confirmation error:', err);

        return res.status(500).json({
            message: 'Помилка при підтвердженні 3DS',
            error: err.message,
        });
    }
};

const cancelCheckoutPayment = async (req, res) => {
    try {
        const { checkoutId } = req.params;

        const checkout = await Checkout.findById(checkoutId);

        if (!checkout) {
            return res.status(404).json({
                message: 'Checkout не знайдено',
            });
        }

        if (String(checkout.buyer) !== String(req.user.id)) {
            return res.status(403).json({
                message: 'Ви можете скасувати тільки власний checkout',
            });
        }

        if (checkout.paymentStatus === 'paid_test') {
            return res.status(400).json({
                message: 'Оплачений checkout не можна скасувати',
            });
        }

        const payment = await Payment.findOne({
            checkout: checkout._id,
            buyer: req.user.id,
            status: {
                $in: ['processing', 'requires_action', 'failed'],
            },
        }).sort({
            createdAt: -1,
        });

        if (payment) {
            payment.status = 'cancelled';
            payment.failureReason = 'Checkout скасовано користувачем';

            await payment.save();

            checkout.payment = payment._id;
        }

        checkout.paymentStatus = 'cancelled';
        checkout.checkoutStatus = 'cancelled';

        await checkout.save();

        const populatedCheckout = await populateCheckout(checkout._id);

        return res.status(200).json({
            message: 'Checkout скасовано',
            checkout: populatedCheckout,
            payment,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при скасуванні checkout',
            error: err.message,
        });
    }
};

const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            buyer: req.user.id,
        })
            .populate({
                path: 'checkout',
            })
            .populate({
                path: 'item',
                select: 'name price img location',
            })
            .populate({
                path: 'seller',
                select: '-password -roles -__v',
            })
            .sort({
                createdAt: -1,
            });

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

const getMySalesPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            seller: req.user.id,
        })
            .populate({
                path: 'checkout',
            })
            .populate({
                path: 'item',
                select: 'name price img location',
            })
            .populate({
                path: 'buyer',
                select: '-password -roles -__v',
            })
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            payments,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при отриманні продажів',
            error: err.message,
        });
    }
};

module.exports = {
    getPaymentById,
    payCheckoutWithGooglePay,
    simulateCheckoutCardPayment,
    confirmCheckout3DS,
    cancelCheckoutPayment,
    getMyPayments,
    getMySalesPayments,
};
