const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
    {
        item: {
            type: String,
            ref: 'Item',
            required: true,
        },
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reason: {
            type: String,
            enum: [
                'fraud',
                'wrong_category',
                'prohibited',
                'fake',
                'duplicate',
                'offensive',
                'other',
            ],
            required: true,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
            default: 'pending',
        },
        adminComment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: '',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

ReportSchema.index({ item: 1, reporter: 1 }, { unique: true });
ReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);