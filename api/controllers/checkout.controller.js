const Checkout = require('../models/checkout_model');
const Item = require('../models/item_model');

function getEntityId(entity) {
    if (!entity) return '';

    if (typeof entity === 'string') {
        return entity;
    }

    if (entity._id) {
        return String(entity._id);
    }

    return String(entity);
}

function parsePrice(value) {
    if (typeof value === 'number') {
        return value;
    }

    if (!value) {
        return 0;
    }

    const normalized = String(value)
        .replace(/\s/g, '')
        .replace(/[^\d.,]/g, '')
        .replace(',', '.');

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
}

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

const createCheckout = async (req, res) => {
    try {
        const {
            itemId,
            method = 'google_pay_simulation',
            deliveryType = 'agreement',
            deliveryCity = '',
            deliveryAddress = '',
            receiverName = '',
            buyerPhone = '',
            buyerComment = '',
        } = req.body;

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

        if (item.isArchived) {
            return res.status(409).json({
                message: 'Цей товар уже куплено або він недоступний',
            });
        }

        const sellerId = getEntityId(item.owner);
        const buyerId = String(req.user.id);

        if (sellerId === buyerId) {
            return res.status(400).json({
                message: 'Не можна купити власний товар',
            });
        }

        const amount = parsePrice(item.price);
        const serviceFee = 0;
        const totalAmount = amount + serviceFee;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: 'Некоректна ціна товару',
            });
        }

        const checkout = await Checkout.create({
            item: item._id,
            buyer: req.user.id,
            seller: sellerId,
            amount,
            serviceFee,
            totalAmount,
            currency: 'UAH',
            paymentMethod: method,
            paymentStatus: method === 'cash_on_delivery' ? 'paid_test' : 'pending',
            checkoutStatus: method === 'cash_on_delivery' ? 'paid' : 'awaiting_payment',
            delivery: {
                type: deliveryType,
                city: deliveryCity,
                address: deliveryAddress,
                receiverName,
                phone: buyerPhone,
                comment: buyerComment,
            },
            paidAt: method === 'cash_on_delivery' ? new Date() : null,
        });

        if (method === 'cash_on_delivery') {
            await Item.findByIdAndUpdate(item._id, {
                $set: {
                    isArchived: true,
                    archivedAt: new Date(),
                    archivedByCheckout: checkout._id,
                },
            });
        }

        const populatedCheckout = await populateCheckout(checkout._id);

        return res.status(201).json({
            message: 'Checkout створено',
            checkout: populatedCheckout,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при створенні checkout',
            error: err.message,
        });
    }
};

const getCheckoutById = async (req, res) => {
    try {
        const checkout = await populateCheckout(req.params.id);

        if (!checkout) {
            return res.status(404).json({
                message: 'Checkout не знайдено',
            });
        }

        const isBuyer = String(checkout.buyer._id) === String(req.user.id);
        const isSeller = String(checkout.seller._id) === String(req.user.id);

        if (!isBuyer && !isSeller) {
            return res.status(403).json({
                message: 'Немає доступу до цього checkout',
            });
        }

        return res.status(200).json({
            checkout,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при отриманні checkout',
            error: err.message,
        });
    }
};

module.exports = {
    createCheckout,
    getCheckoutById,
};
