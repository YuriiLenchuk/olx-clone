const uuidv4 = require('uuid').v4;
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true,
    },
    img: {
        type: [String],
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isNewState: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    categoryData: {
        category: {
            type: String,
            required: true,
        },
        subcategory: {
            type: String,
            required: false,
        },
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    archivedAt: {
        type: Date,
        default: null,
    },
    archivedByCheckout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkout',
        default: null,
    },
});

module.exports = mongoose.model('Item', ItemSchema);
