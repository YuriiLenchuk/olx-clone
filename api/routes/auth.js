const express = require('express');
const { check } = require('express-validator');

const { registration, login, me, getUsers } = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMIddleware');

const router = express.Router();

router.post(
    '/registration',
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

router.post('/login', login);

router.get('/me', authMiddleware, me);

router.get('/users', roleMiddleware(['ADMIN']), getUsers);

module.exports = router;
