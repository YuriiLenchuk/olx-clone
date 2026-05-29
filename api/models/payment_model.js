const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        item: {
            type: String,
            ref: 'Item',
            required: true,
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: 'UAH',
        },

        method: {
            type: String,
            enum: ['google_pay_simulation', 'card_simulation'],
            default: 'google_pay_simulation',
        },

        status: {
            type: String,
            enum: ['pending', 'processing', 'requires_action', 'paid', 'failed', 'cancelled'],
            default: 'pending',
        },

        providerPaymentId: {
            type: String,
            default: null,
        },

        cardInfo: {
            brand: {
                type: String,
                default: null,
            },
            last4: {
                type: String,
                default: null,
            },
        },

        failureReason: {
            type: String,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Payment', PaymentSchema);