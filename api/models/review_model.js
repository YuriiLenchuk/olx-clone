const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        targetUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        item: {
            type: String,
            ref: 'Item',
            default: null,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 500,
            default: '',
        },
    },
    {
        timestamps: true,
    },
);

ReviewSchema.index(
    {
        targetUser: 1,
        author: 1,
    },
    {
        unique: true,
    },
);

module.exports = mongoose.model('Review', ReviewSchema);
