const Category = require('../models/category_model');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            photoFilename: { $exists: true, $ne: null },
        }).populate({
            path: 'subcategories',
            select: 'name path -_id',
        });

        const rez = categories.map(cat => ({
            name: cat.name,
            path: cat.path,
            img: cat.photoFilename,
            subcategories: cat.subcategories.map(sub => ({
                name: sub.name,
                path: sub.path,
            })),
        }));
        return res.status(200).json(rez);
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getCategories,
};
