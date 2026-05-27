const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
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

        lastMessageText: {
            type: String,
            default: '',
        },

        lastMessageAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

ChatSchema.index(
    {
        item: 1,
        buyer: 1,
        seller: 1,
    },
    {
        unique: true,
    },
);

module.exports = mongoose.model('Chat', ChatSchema);
