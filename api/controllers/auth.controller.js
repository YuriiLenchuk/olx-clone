// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { validationResult } = require('express-validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const Role = require('../models/role_model');
const { secret } = require('../config');

const generateAccesToken = (id, role) => {
    const payload = { id, role };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

const registration = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Помилка про реєстрації', errors });
        }
        const { username, password } = req.body;
        const candidate = await User.findOne({ username }, undefined, undefined);
        if (candidate) {
            return res.status(409).json('Користувач з таким ім\'ям вже ісеує');
        }
        const hashPassword = bcrypt.hashSync(password, 7);
        const user = new User({ username, password: hashPassword, roles: ['USER'] });
        await user.save();
        const {_id, roles} = await User.findOne({ username }, undefined, undefined);
        const token = generateAccesToken(_id, roles);
        return res.json({ token });
    } catch (e) {
        console.log(e);
        return res.status(409).json({ message: 'register error' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }, undefined, undefined);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Невірне ім\'я користувача, або пароль' });
        }
        // eslint-disable-next-line no-underscore-dangle
        const token = generateAccesToken(user._id, user.roles);
        return res.json({ token });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: 'login error' });
    }
};

const getUsers = async (req, res) => {
    try {
        res.status(200).json(await User.find(undefined, undefined, undefined));
    } catch (e) {
        res.json('err');
    }
};

module.exports = {
    registration,
    login,
    getUsers,
};
