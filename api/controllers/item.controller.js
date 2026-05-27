const Item = require('../models/item_model');
const {log} = require("debug");

function isAdmin(req) {
    return Array.isArray(req.user?.roles) && req.user.roles.includes('ADMIN');
}

function isOwner(item, req) {
    return String(item) === String(req.user?.id);
}
const getAllItems = async (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page, 10) || 1; // номер сторінки
    limit = parseInt(limit, 10) || 10; // кількість елементів на сторінку
    const skip = (page - 1) * limit;

    try {
        const items = await Item.find()
            .select('-__v')
            .populate({
                path: 'owner',
                select: '-_id -password -roles -__v',
            })
            .skip(skip)
            .limit(limit);

        const totalItems = await Item.countDocuments();

        return res
            .status(200)
            .json({ items, page, limit, totalPages: Math.ceil(totalItems / limit), totalItems });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Помилка при отриманні товарів', error: err.message });
    }
};

// eslint-disable-next-line consistent-return
const getItemByCategory = async (req, res) => {
    try {
        const { name } = req.params;
        const { page, limit, sort } = req.query;

        const skip = ((parseInt(page, 10) || 1) - 1) * (parseInt(limit, 10) || 10);

        if (!name) {
            return res.status(400).json({ error: 'Параметр "name" є обовʼязковим.' });
        }

        const filter = {
            $or: [{ 'categoryData.category': name }, { 'categoryData.subcategory': name }],
        };

        const items = await Item.find()
            .sort(sort)
            .select('-__v')
            .populate({
                path: 'owner',
                select: '-_id -password -roles -__v',
            })
            .skip(skip)
            .limit(parseInt(limit, 10) || 10);

        const totalItems = await Item.countDocuments(filter);

        return res
            .status(200)
            .json({ items, page, limit, totalPages: Math.ceil(totalItems / limit), totalItems });
    } catch (err) {
        console.error('Помилка при пошуку товарів:', err);
        res.status(500).json({ error: 'Внутрішня помилка сервера.' });
    }
};

// GET /api/items/:id — отримати один товар
const getItemById = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page, 10) || 1; // номер сторінки
        limit = parseInt(limit, 10) || 10; // кількість елементів на сторінку
        const skip = (page - 1) * limit;

        const items = await Item.findById(req.params.id)
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
    if (!name.trim()) errors.append('Назва');
    if (!description.trim()) errors.append('Опис');
    if (!price.trim()) errors.append('Ціна');
    if (Number(price) <= 0) errors.append('Ціна нижче 0');
    if (isNewState === undefined) errors.append('Виберіть стан');
    if (!location.trim()) errors.append('Місто');
    if (!categoryData) errors.append('Категорія');
    if (img.length === 0) errors.append('Додайте зображення');

    return errors;
}
// POST /api/items — створити новий товар
const createItem = async (req, res) => {
    try {
        // eslint-disable-next-line no-unused-expressions
        req.body.isNewState === 'true'
            ? (req.body.isNewState = true)
            : (req.body.isNewState = false);

        const { name, img, description, price, isNewState, location, categoryData } = req.body;
        // Валідація обов'язкових полів
        const validatedInfo = await validateInfo(req);
        console.log(validatedInfo);
        console.log(req.body);
        if (validatedInfo.length) {
            return res.status(400).json({
                message: 'Обов’язкові поля відсутні або некоректні',
                missedFields: validatedInfo,
            });
        }
        const newItem = new Item({
            name,
            img,
            description,
            price: parseInt(price, 10),
            isNewState,
            owner: req.user.id,
            location,
            categoryData: JSON.parse(categoryData),
        });

        const savedItem = await newItem.save();
        return res.status(201).json(savedItem);
    } catch (err) {
        console.log(err)
        return res
            .status(400)
            .json({ message: 'Помилка при створенні товару', error: err.message });
    }
};

// DELETE /api/items/:id — видалити товар
const deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Товар не знайдено' });
        return res.status(200).json({ message: 'Товар успішно видалено' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Помилка при видаленні товару', error: err.message });
    }
};

// PUT /api/items/:id — оновити товар
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log(req);

        // Якщо передано categoryData, перевіримо, що category обов'язкове
        if (updateData.categoryData && typeof updateData.categoryData.category !== 'string') {
            return res.status(400).json({
                message: 'Поле category у categoryData є обов’язковим і має бути рядком',
            });
        }
        console.log(updateData);

        const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
            new: true, // повернути оновлений документ
            runValidators: true, // запустити валідацію
        });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Товар не знайдено' });
        }

        return res.status(200).json(updatedItem);
    } catch (err) {
        return res
            .status(400)
            .json({ message: 'Помилка при оновленні товару', error: err.message });
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
};
