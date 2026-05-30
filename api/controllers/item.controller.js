const Item = require('../models/item_model');

const isAdmin = req => {
    return Array.isArray(req.user?.roles) && req.user.roles.includes('ADMIN');
};

const isItemOwner = (item, userId) => {
    return String(item.owner) === String(userId);
};

const canManageItem = (req, item) => {
    return isAdmin(req) || isItemOwner(item, req.user?.id);
};

const parseBoolean = value => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
};

const parseCategoryData = categoryData => {
    if (!categoryData) return null;

    if (typeof categoryData === 'string') {
        try {
            return JSON.parse(categoryData);
        } catch {
            throw new Error('categoryData має бути валідним JSON');
        }
    }

    return categoryData;
};

const normalizePageLimit = query => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

const escapeRegExp = value => {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const publicItemFilter = () => ({
    isArchived: { $ne: true },
    archivedAt: null,
    archivedByCheckout: null,
});

const getAllItems = async (req, res) => {
    try {
        const { page, limit, search, sort } = req.query;
        const normalizedPage = Math.max(parseInt(page, 10) || 1, 1);
        const normalizedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
        const skip = (normalizedPage - 1) * normalizedLimit;

        const filter = publicItemFilter();

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

        const items = await Item.find(filter)
            .sort(sortOptions)
            .select('-__v')
            .populate({
                path: 'owner',
                select: '-_id -password -roles -__v',
            })
            .skip(skip)
            .limit(normalizedLimit);

        const totalItems = await Item.countDocuments(filter);

        return res.status(200).json({
            items,
            page: normalizedPage,
            limit: normalizedLimit,
            totalPages: Math.ceil(totalItems / normalizedLimit),
            totalItems,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при отриманні товарів',
            error: err.message,
        });
    }
};

const getItemByCategory = async (req, res) => {
    try {
        const { name } = req.params;
        const { page, limit, sort } = req.query;

        const normalizedPage = Math.max(parseInt(page, 10) || 1, 1);
        const normalizedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
        const skip = (normalizedPage - 1) * normalizedLimit;

        if (!name) {
            return res.status(400).json({
                error: 'Параметр "name" є обовʼязковим.',
            });
        }

        const filter = {
            ...publicItemFilter(),
            $or: [{ 'categoryData.category': name }, { 'categoryData.subcategory': name }],
        };

        const sortOptions =
            sort === 'price'
                ? { price: 1 }
                : sort === '-price'
                    ? { price: -1 }
                    : sort === 'date'
                        ? { date: 1 }
                        : { date: -1 };

        const items = await Item.find(filter)
            .sort(sortOptions)
            .select('-__v')
            .populate({
                path: 'owner',
                select: '-_id -password -roles -__v',
            })
            .skip(skip)
            .limit(normalizedLimit);

        const totalItems = await Item.countDocuments(filter);

        return res.status(200).json({
            items,
            page: normalizedPage,
            limit: normalizedLimit,
            totalPages: Math.ceil(totalItems / normalizedLimit),
            totalItems,
        });
    } catch (err) {
        console.error('Помилка при пошуку товарів:', err);

        return res.status(500).json({
            error: 'Внутрішня помилка сервера.',
            message: err.message,
        });
    }
};

const getItemById = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 10;
        const skip = (page - 1) * limit;

        const items = await Item.findOne({
            _id: req.params.id,
            ...publicItemFilter(),
        })
            .select('-__v')
            .populate({
                path: 'owner',
                select: '-_id -password -roles -__v',
            })
            .skip(skip)
            .limit(limit);

        if (!items) return res.status(404).json({ message: 'Товар не знайдено' });
        const totalItems = await Item.countDocuments();

        return res
            .status(200)
            .json({ items, page, limit, totalPages: Math.ceil(totalItems / limit), totalItems });
    } catch (err) {
        return res.status(500).json({ message: 'Помилка при пошуку товару', error: err.message });
    }
};

function validateInfo(req) {
    const { name, img, description, price, isNewState, owner, location, categoryData } = req.body;
    const errors = [];
    if (!name.trim()) errors.push('Назва');
    if (!description.trim()) errors.push('Опис');
    if (!price.trim()) errors.push('Ціна');
    if (Number(price) <= 0) errors.push('Ціна нижче 0');
    if (isNewState === undefined) errors.push('Виберіть стан');
    if (!location.trim()) errors.push('Місто');
    if (!categoryData) errors.push('Категорія');
    if (img.length === 0) errors.push('Додайте зображення');

    return errors;
}

const validateCreateItem = (req, res, next) => {
    try {
        const errors = [];

        const name = String(req.body.name || '').trim();
        const description = String(req.body.description || '').trim();
        const price = Number(req.body.price);
        const location = String(req.body.location || '').trim();
        const isNewState = parseBoolean(req.body.isNewState ?? req.body.newState);
        const categoryData = parseCategoryData(req.body.categoryData);

        if (!name) errors.push('Назва');
        if (!description) errors.push('Опис');
        if (!Number.isFinite(price) || price <= 0) errors.push('Ціна');
        if (typeof isNewState !== 'boolean') errors.push('Виберіть стан');
        if (!location) errors.push('Місто');
        if (!categoryData?.category) errors.push('Категорія');
        if (!req.files?.length) errors.push('Додайте зображення');

        if (errors.length) {
            return res.status(400).json({
                message: 'Обов’язкові поля відсутні або некоректні',
                missedFields: errors,
            });
        }

        req.body.name = name;
        req.body.description = description;
        req.body.price = price;
        req.body.location = location;
        req.body.isNewState = isNewState;
        req.body.categoryData = categoryData;

        return next();
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

const createItem = async (req, res) => {
    try {
        const { name, img, description, price, isNewState, location, categoryData } = req.body;

        const newItem = new Item({
            name,
            img,
            description,
            price,
            isNewState,
            owner: req.user.id,
            location,
            categoryData,
        });

        const savedItem = await newItem.save();

        return res.status(201).json(savedItem);
    } catch (err) {
        return res.status(400).json({
            message: 'Помилка при створенні товару',
            error: err.message,
        });
    }
};

const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: 'Товар не знайдено',
            });
        }

        if (!canManageItem(req, item)) {
            return res.status(403).json({
                message: 'Ви можете видаляти тільки власні товари',
            });
        }
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Товар не знайдено' });
        return res.status(200).json({ message: 'Товар успішно видалено' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Помилка при видаленні товару', error: err.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                message: 'Товар не знайдено',
            });
        }

        if (!canManageItem(req, item)) {
            return res.status(403).json({
                message: 'Ви можете редагувати тільки власні товари',
            });
        }

        const updateData = { ...req.body };

        delete updateData._id;
        delete updateData.owner;
        delete updateData.__v;
        delete updateData.date;

        if (Object.prototype.hasOwnProperty.call(updateData, 'price')) {
            const normalizedPrice = Number(updateData.price);

            if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
                return res.status(400).json({
                    message: 'Поле price має бути коректним числом',
                });
            }

            updateData.price = normalizedPrice;
        }

        if (Object.prototype.hasOwnProperty.call(updateData, 'isNewState')) {
            const normalizedIsNewState = parseBoolean(updateData.isNewState);

            if (typeof normalizedIsNewState !== 'boolean') {
                return res.status(400).json({
                    message: 'Поле isNewState має бути boolean',
                });
            }

            updateData.isNewState = normalizedIsNewState;
        }

        if (Object.prototype.hasOwnProperty.call(updateData, 'categoryData')) {
            const normalizedCategoryData = parseCategoryData(updateData.categoryData);

            if (!normalizedCategoryData || typeof normalizedCategoryData.category !== 'string') {
                return res.status(400).json({
                    message: 'Поле category у categoryData є обов’язковим і має бути рядком',
                });
            }

            updateData.categoryData = normalizedCategoryData;
        }

        const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .select('-__v')
            .populate({
                path: 'owner',
                select: '-password -roles -__v',
            });

        return res.status(200).json({
            message: 'Товар оновлено',
            item: updatedItem,
        });
    } catch (err) {
        return res.status(400).json({
            message: 'Помилка при оновленні товару',
            error: err.message,
        });
    }
};

const getMyItems = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 12;

        const skip = (page - 1) * limit;

        const filter = {
            owner: req.user.id,
            ...publicItemFilter(),
        };

        const items = await Item.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .select('-__v')
            .populate({
                path: 'owner',
                select: '-password -roles -__v',
            })
            .skip(skip)
            .limit(limit);

        const totalItems = await Item.countDocuments(filter);

        return res.status(200).json({
            items,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Помилка при отриманні ваших оголошень',
            error: err.message,
        });
    }
};

module.exports = {
    getAllItems,
    getItemById,
    getItemByCategory,
    createItem,
    deleteItem,
    updateItem,
    getMyItems,
    validateCreateItem,
};
