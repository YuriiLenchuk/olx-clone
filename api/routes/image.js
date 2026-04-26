const express = require('express');
const { getImg, deleteImg, deleteImgs } = require('../controllers/image');

const router = express.Router();

router.get('/:filename', getImg);

router.delete('/delete/:id', deleteImg);

router.delete('/delete/', deleteImgs);

module.exports = router;
