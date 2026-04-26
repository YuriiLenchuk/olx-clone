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

const router = express.Router();

router.get('/', getAllItems);

router.get('/:id', getItemById);

router.get('/category/:name', getItemByCategory);

router.post('/', upload.array('img', 5), uploadToGridFS, createItem);

router.put('/:id', updateItem);

router.patch('/:id', updateItem);

router.delete('/:id', deleteItem);

module.exports = router;
