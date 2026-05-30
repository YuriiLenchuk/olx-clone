const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const {
    getFavorites,
    getFavoriteIds,
    addFavorite,
    removeFavorite,
    clearFavorites,
} = require('../controllers/favorite.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getFavorites);
router.get('/ids', getFavoriteIds);
router.post('/:itemId', addFavorite);
router.delete('/:itemId', removeFavorite);
router.delete('/', clearFavorites);

module.exports = router;