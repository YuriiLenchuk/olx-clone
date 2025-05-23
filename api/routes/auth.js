const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { check } = require('express-validator');
const { registration, login, getUsers } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMIddleware');

const router = express.Router();

router.post(
    '/registration',
    [
        check('username', 'Ім\'я користувача не може бути пустим').notEmpty(),
        check('password', 'Пароль не може бути пустим').notEmpty(),
    ],
    registration,
);

router.post('/login', login);

router.get('/users', roleMiddleware(['ADMIN']), getUsers);

module.exports = router;
