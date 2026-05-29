const express = require('express');
const { check } = require('express-validator');

const {
    registration,
    login,
    me,
    updateMe,
    getUsers,
    updateUsername,
    updatePassword,
    deleteMe,
} = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMIddleware');
const authLimiter = require('../middleware/authLimiter');

const router = express.Router();

router.post(
    '/registration',
    authLimiter,
    [
        check('username', 'Імʼя користувача не може бути пустим').notEmpty(),
        check('username', 'Імʼя користувача має містити мінімум 3 символи').isLength({
            min: 3,
        }),
        check('password', 'Пароль не може бути пустим').notEmpty(),
        check('password', 'Пароль має містити мінімум 6 символів').isLength({
            min: 6,
        }),
        check('email', 'Некоректний email').optional({ checkFalsy: true }).isEmail(),
    ],
    registration,
);

router.post('/login', authLimiter, login);

router.get('/me', authMiddleware, me);

router.patch(
    '/me',
    authMiddleware,
    authLimiter,
    [check('email', 'Некоректний email').optional({ checkFalsy: true }).isEmail()],
    updateMe,
);

router.get('/users', roleMiddleware(['ADMIN']), getUsers);

router.patch(
    '/me/username',
    authMiddleware,
    [
        check('username', 'Логін не може бути пустим').notEmpty(),
        check('username', 'Логін має містити мінімум 3 символи').isLength({
            min: 3,
        }),
    ],
    updateUsername,
);

router.patch('/me/password', authMiddleware, updatePassword);

router.delete('/me', authMiddleware, deleteMe);

module.exports = router;
