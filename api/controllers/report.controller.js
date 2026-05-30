const Report = require('../models/report_model');
const Item = require('../models/item_model');

const REPORT_REASONS = new Set([
    'fraud',
    'wrong_category',
    'prohibited',
    'fake',
    'duplicate',
    'offensive',
    'other',
]);

const REPORT_STATUSES = new Set([
    'pending',
    'reviewed',
    'resolved',
    'dismissed',
]);

function normalizePageLimit(query) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

function populateReport(query) {
    return query
        .populate({
            path: 'item',
            select: 'name img price location owner categoryData isArchived archivedAt',
            populate: {
                path: 'owner',
                select: 'username firstName lastName email',
            },
        })
        .populate({
            path: 'reporter',
            select: 'username firstName lastName email',
        })
        .populate({
            path: 'reviewedBy',
            select: 'username firstName lastName email',
        });
}

const createReport = async (req, res) => {
    try {
        const itemId = String(req.body?.itemId || '').trim();
        const reason = String(req.body?.reason || '').trim();
        const comment = String(req.body?.comment || '').trim();

        if (!itemId) {
            return res.status(400).json({
                message: 'itemId є обовʼязковим',
            });
        }

        if (!REPORT_REASONS.has(reason)) {
            return res.status(400).json({
                message: 'Оберіть коректну причину скарги',
            });
        }

        const item = await Item.findOne({
            _id: itemId,
            isArchived: { $ne: true },
        });

        if (!item) {
            return res.status(404).json({
                message: 'Оголошення не знайдено або воно недоступне',
            });
        }

        if (String(item.owner) === String(req.user.id)) {
            return res.status(400).json({
                message: 'Не можна поскаржитися на власне оголошення',
            });
        }

        const existingReport = await Report.findOne({
            item: itemId,
            reporter: req.user.id,
        });

        if (existingReport) {
            return res.status(409).json({
                message: 'Ви вже відправляли скаргу на це оголошення',
                report: existingReport,
            });
        }

        const report = await Report.create({
            item: itemId,
            reporter: req.user.id,
            reason,
            comment,
        });

        const populatedReport = await populateReport(Report.findById(report._id));

        return res.status(201).json({
            message: 'Скаргу відправлено на перевірку',
            report: populatedReport,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Ви вже відправляли скаргу на це оголошення',
            });
        }

        return res.status(500).json({
            message: 'Помилка при створенні скарги',
            error: error.message,
        });
    }
};

const getMyReportForItem = async (req, res) => {
    try {
        const report = await Report.findOne({
            item: req.params.itemId,
            reporter: req.user.id,
        });

        return res.status(200).json({
            report,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при перевірці скарги',
            error: error.message,
        });
    }
};

const getAdminReports = async (req, res) => {
    try {
        const { status } = req.query;
        const { page, limit, skip } = normalizePageLimit(req.query);

        const filter = {};

        if (status && status !== 'all') {
            if (!REPORT_STATUSES.has(status)) {
                return res.status(400).json({
                    message: 'Некоректний статус скарги',
                });
            }

            filter.status = status;
        }

        const reports = await populateReport(
            Report.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
        );

        const totalReports = await Report.countDocuments(filter);

        return res.status(200).json({
            reports,
            page,
            limit,
            totalPages: Math.ceil(totalReports / limit),
            totalReports,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні скарг',
            error: error.message,
        });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const status = String(req.body?.status || '').trim();
        const adminComment = String(req.body?.adminComment || '').trim();

        if (!REPORT_STATUSES.has(status)) {
            return res.status(400).json({
                message: 'Некоректний статус скарги',
            });
        }

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: 'Скаргу не знайдено',
            });
        }

        report.status = status;
        report.adminComment = adminComment;
        report.reviewedBy = req.user.id;
        report.reviewedAt = new Date();

        await report.save();

        const populatedReport = await populateReport(Report.findById(report._id));

        return res.status(200).json({
            message: 'Статус скарги оновлено',
            report: populatedReport,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при оновленні скарги',
            error: error.message,
        });
    }
};

module.exports = {
    createReport,
    getMyReportForItem,
    getAdminReports,
    updateReportStatus,
};