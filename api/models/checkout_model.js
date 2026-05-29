const mongoose = require('mongoose');

const CheckoutSchema = new mongoose.Schema(
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

        serviceFee: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: 'UAH',
        },

        delivery: {
            type: {
                type: String,
                enum: ['pickup', 'delivery', 'agreement'],
                default: 'agreement',
            },

            city: {
                type: String,
                default: '',
            },

            address: {
                type: String,
                default: '',
            },

            receiverName: {
                type: String,
                default: '',
            },

            phone: {
                type: String,
                default: '',
            },

            comment: {
                type: String,
                default: '',
            },
        },

        paymentMethod: {
            type: String,
            enum: ['google_pay_simulation', 'card_simulation', 'cash_on_delivery'],
            default: 'google_pay_simulation',
        },

        paymentStatus: {
            type: String,
            enum: ['pending', 'processing', 'paid_test', 'failed', 'cancelled'],
            default: 'pending',
        },

        checkoutStatus: {
            type: String,
            enum: ['awaiting_payment', 'paid', 'failed', 'cancelled'],
            default: 'awaiting_payment',
        },

        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
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

module.exports = mongoose.model('Checkout', CheckoutSchema);