const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        checkout: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Checkout',
            required: true,
        },

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
            enum: ['google_pay_simulation', 'card_simulation', 'cash_on_delivery'],
            required: true,
        },

        status: {
            type: String,
            enum: [
                'processing',
                'requires_action',
                'paid_test',
                'failed',
                'cancelled',
            ],
            default: 'processing',
        },

        mockTransactionId: {
            type: String,
            default: null,
        },

        googlePayInfo: {
            cardNetwork: {
                type: String,
                default: null,
            },

            cardDetails: {
                type: String,
                default: null,
            },

            description: {
                type: String,
                default: null,
            },
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