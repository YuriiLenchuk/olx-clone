const express = require('express');
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem, getItemByCategory,
} = require('../controllers/item.controller');

const upload = require('../middleware/uploadMiddleware');
const uploadToGridFS = require('../controllers/gridfsUploadController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllItems);

router.get('/category/:name', getItemByCategory);

router.get('/:id', getItemById);

router.post('/', authMiddleware, upload.array('img', 5), uploadToGridFS, createItem);

router.put('/:id', authMiddleware, updateItem);

router.patch('/:id', authMiddleware, updateItem);

router.delete('/:id', authMiddleware, deleteItem);

module.exports = router;
