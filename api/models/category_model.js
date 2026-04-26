const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    photoFilename: {
        type: String, // зберігати тут ім'я файлу в GridFS
        required: false,
    },
    subcategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
});

module.exports = mongoose.model('Category', CategorySchema);
