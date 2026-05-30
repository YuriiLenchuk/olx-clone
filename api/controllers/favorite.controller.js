const Favorite = require('../models/favorite_model');
const Item = require('../models/item_model');

const populateFavorite = query => {
    return query.populate({
        path: 'item',
        match: { isArchived: { $ne: true } },
        select: '-__v',
        populate: {
            path: 'owner',
            select: '-password -roles -__v',
        },
    });
};

const getFavorites = async (req, res) => {
    try {
        const favorites = await populateFavorite(
            Favorite.find({ user: req.user.id }).sort({ createdAt: -1 }),
        );

        const items = favorites
            .map(favorite => favorite.item)
            .filter(Boolean);

        return res.status(200).json({
            items,
            favoriteIds: items.map(item => item._id),
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні збережених оголошень',
            error: error.message,
        });
    }
};

const getFavoriteIds = async (req, res) => {
    try {
        const favorites = await populateFavorite(
            Favorite.find({ user: req.user.id }).select('item'),
        );

        return res.status(200).json({
            favoriteIds: favorites
                .map(favorite => favorite.item?._id)
                .filter(Boolean),
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при отриманні списку обраного',
            error: error.message,
        });
    }
};

const addFavorite = async (req, res) => {
    try {
        const itemId = String(req.params.itemId || '').trim();

        const item = await Item.findOne({
            _id: itemId,
            isArchived: { $ne: true },
        });

        if (!item) {
            return res.status(404).json({
                message: 'Оголошення не знайдено або воно недоступне',
            });
        }

        await Favorite.findOneAndUpdate(
            { user: req.user.id, item: itemId },
            { user: req.user.id, item: itemId },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        return res.status(200).json({
            message: 'Оголошення додано в обране',
            itemId,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при додаванні в обране',
            error: error.message,
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const itemId = String(req.params.itemId || '').trim();

        await Favorite.deleteOne({
            user: req.user.id,
            item: itemId,
        });

        return res.status(200).json({
            message: 'Оголошення прибрано з обраного',
            itemId,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при видаленні з обраного',
            error: error.message,
        });
    }
};

const clearFavorites = async (req, res) => {
    try {
        await Favorite.deleteMany({ user: req.user.id });

        return res.status(200).json({
            message: 'Список обраного очищено',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Помилка при очищенні обраного',
            error: error.message,
        });
    }
};

module.exports = {
    getFavorites,
    getFavoriteIds,
    addFavorite,
    removeFavorite,
    clearFavorites,
};