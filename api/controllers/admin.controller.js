const User = require('../models/user_model');
const Item = require('../models/item_model');
const Report = require('../models/report_model');

const USER_ROLES = new Set(['USER', 'ADMIN']);
const REPORT_STATUSES = ['pending', 'reviewed', 'resolved', 'dismissed'];

const normalizePageLimit = query => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

const escapeRegExp = value => {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const populateAdminItem = query => {
    return query
        .select('-__v')
        .populate({
            path: 'owner',
            select: 'username firstName lastName email roles isBlocked',
        });
};

const getAdminStats = async (req, res) => {
    try {
        const [
            totalUsers,
            blockedUsers,
            admins,
            totalItems,
            activeItems,
            archivedItems,
            totalReports,
            reportRows,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isBlocked: true }),
            User.countDocuments({ roles: 'ADMIN' }),
            Item.countDocuments(),
            Item.countDocuments({ isArchived: { $ne: true } }),
            Item.countDocuments({ isArchived: true }),
            Report.countDocuments(),
            Report.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const reportsByStatus = REPORT_STATUSES.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});

        reportRows.forEach(row => {
            reportsByStatus[row._id] = row.count;
        });

        return res.status(200).json({
            users: {
                total: totalUsers,
                blocked: blockedUsers,
                admins,
            },
            items: {
                total: totalItems,
                active: activeItems,
                archived: archivedItems,
            },
            reports: {
                total: totalReports,
                byStatus: reportsByStatus,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні статистики адмін-панелі',
            error: error.message,
        });
    }
};

const getAdminItems = async (req, res) => {
    try {
        const { search, status = 'active', sort } = req.query;
        const { page, limit, skip } = normalizePageLimit(req.query);

        const filter = {};

        if (status === 'active') {
            filter.isArchived = { $ne: true };
        } else if (status === 'archived') {
            filter.isArchived = true;
        } else if (status !== 'all') {
            return res.status(400).json({
                message: 'Некоректний статус оголошення',
            });
        }

        const normalizedSearch = String(search || '').trim();

        if (normalizedSearch) {
            const searchRegex = new RegExp(escapeRegExp(normalizedSearch), 'i');

            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { location: searchRegex },
                { 'categoryData.category': searchRegex },
                { 'categoryData.subcategory': searchRegex },
            ];
        }

        const sortOptions =
            sort === 'price'
                ? { price: 1 }
                : sort === '-price'
                    ? { price: -1 }
                    : sort === 'date'
                        ? { date: 1 }
                        : { date: -1 };

        const items = await populateAdminItem(
            Item.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit),
        );

        const totalItems = await Item.countDocuments(filter);

        return res.status(200).json({
            items,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні оголошень',
            error: error.message,
        });
    }
};

const getAdminUsers = async (req, res) => {
    try {
        const { search, role = 'all', status = 'all' } = req.query;
        const { page, limit, skip } = normalizePageLimit(req.query);

        const filter = {};

        if (role !== 'all') {
            if (!USER_ROLES.has(role)) {
                return res.status(400).json({
                    message: 'Некоректна роль користувача',
                });
            }

            filter.roles = role;
        }

        if (status === 'active') {
            filter.isBlocked = { $ne: true };
        } else if (status === 'blocked') {
            filter.isBlocked = true;
        } else if (status !== 'all') {
            return res.status(400).json({
                message: 'Некоректний статус користувача',
            });
        }

        const normalizedSearch = String(search || '').trim();

        if (normalizedSearch) {
            const searchRegex = new RegExp(escapeRegExp(normalizedSearch), 'i');

            filter.$or = [
                { username: searchRegex },
                { email: searchRegex },
                { firstName: searchRegex },
                { lastName: searchRegex },
                { city: searchRegex },
            ];
        }

        const users = await User.find(filter)
            .select('-password -__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(filter);

        return res.status(200).json({
            users,
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні користувачів',
            error: error.message,
        });
    }
};

const updateUserRoles = async (req, res) => {
    try {
        if (!Array.isArray(req.body.roles)) {
            return res.status(400).json({
                message: 'roles має бути масивом',
            });
        }

        const roles = Array.from(
            new Set(
                req.body.roles
                    .map(role => String(role).trim())
                    .filter(role => USER_ROLES.has(role)),
            ),
        );

        if (!roles.includes('USER')) {
            roles.unshift('USER');
        }

        if (String(req.params.id) === String(req.user.id) && !roles.includes('ADMIN')) {
            return res.status(400).json({
                message: 'Не можна забрати роль ADMIN у самого себе',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { roles },
            { new: true, runValidators: true },
        ).select('-password -__v');

        if (!user) {
            return res.status(404).json({
                message: 'Користувача не знайдено',
            });
        }

        return res.status(200).json({
            message: 'Ролі користувача оновлено',
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при оновленні ролей',
            error: error.message,
        });
    }
};

const updateUserBlock = async (req, res) => {
    try {
        const isBlocked = Boolean(req.body.isBlocked);
        const blockedReason = String(req.body.blockedReason || '').trim();

        if (String(req.params.id) === String(req.user.id) && isBlocked) {
            return res.status(400).json({
                message: 'Не можна заблокувати самого себе',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                isBlocked,
                blockedReason: isBlocked ? blockedReason : '',
                blockedAt: isBlocked ? new Date() : null,
            },
            { new: true, runValidators: true },
        ).select('-password -__v');

        if (!user) {
            return res.status(404).json({
                message: 'Користувача не знайдено',
            });
        }

        return res.status(200).json({
            message: isBlocked ? 'Користувача заблоковано' : 'Користувача розблоковано',
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при зміні статусу користувача',
            error: error.message,
        });
    }
};

const archiveAdminItem = async (req, res) => {
    try {
        const item = await populateAdminItem(
            Item.findByIdAndUpdate(
                req.params.id,
                {
                    isArchived: true,
                    archivedAt: new Date(),
                    archivedByCheckout: null,
                },
                { new: true, runValidators: true },
            ),
        );

        if (!item) {
            return res.status(404).json({
                message: 'Оголошення не знайдено',
            });
        }

        return res.status(200).json({
            message: 'Оголошення перенесено в архів',
            item,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при архівації оголошення',
            error: error.message,
        });
    }
};

const restoreAdminItem = async (req, res) => {
    try {
        const item = await populateAdminItem(
            Item.findByIdAndUpdate(
                req.params.id,
                {
                    isArchived: false,
                    archivedAt: null,
                    archivedByCheckout: null,
                },
                { new: true, runValidators: true },
            ),
        );

        if (!item) {
            return res.status(404).json({
                message: 'Оголошення не знайдено',
            });
        }

        return res.status(200).json({
            message: 'Оголошення відновлено',
            item,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при відновленні оголошення',
            error: error.message,
        });
    }
};

module.exports = {
    getAdminStats,
    getAdminItems,
    getAdminUsers,
    updateUserRoles,
    updateUserBlock,
    archiveAdminItem,
    restoreAdminItem,
};