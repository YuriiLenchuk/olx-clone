const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        email: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        firstName: {
            type: String,
            trim: true,
            default: '',
        },

        lastName: {
            type: String,
            trim: true,
            default: '',
        },

        phone: {
            type: String,
            trim: true,
            default: '',
        },

        city: {
            type: String,
            trim: true,
            default: '',
        },

        avatar: {
            type: String,
            default: '',
        },

        roles: [
            {
                type: String,
                ref: 'Role',
                default: 'USER',
            },
        ],

        isBlocked: {
            type: Boolean,
            default: false,
        },

        blockedAt: {
            type: Date,
            default: null,
        },

        blockedReason: {
            type: String,
            trim: true,
            default: '',
        },

        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviewsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('User', UserSchema);
