const express = require('express');
const { check } = require('express-validator');

const authMiddleware = require('../middleware/authMiddleware');

const {
    getUserReviews,
    createReview,
    updateReview,
    deleteReview,
} = require('../controllers/review.controller');

const router = express.Router();

router.get('/user/:userId', getUserReviews);

router.post(
    '/user/:userId',
    authMiddleware,
    [
        check('rating', 'Оцінка має бути від 1 до 5').isFloat({
            min: 1,
            max: 5,
        }),
        check('comment', 'Коментар не може бути довшим за 500 символів')
            .optional({ checkFalsy: true })
            .isLength({ max: 500 }),
    ],
    createReview,
);

router.patch(
    '/:id',
    authMiddleware,
    [
        check('rating', 'Оцінка має бути від 1 до 5').optional().isFloat({
            min: 1,
            max: 5,
        }),
        check('comment', 'Коментар не може бути довшим за 500 символів')
            .optional({ checkFalsy: true })
            .isLength({ max: 500 }),
    ],
    updateReview,
);

router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
