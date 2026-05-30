const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        item: {
            type: String,
            ref: 'Item',
            required: true,
        },
    },
    { timestamps: true },
);

FavoriteSchema.index({ user: 1, item: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);