const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user_model');
const { secret } = require('../config');

const generateAccessToken = (id, roles) => {
    const payload = { id, roles };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

const getSafeUser = user => ({
    id: user._id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    city: user.city,
    avatar: user.avatar,
    roles: user.roles,
    averageRating: user.averageRating || 0,
    reviewsCount: user.reviewsCount || 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const registration = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Помилка при реєстрації',
                errors,
            });
        }

        const { username, password, email, firstName, lastName, phone, city } = req.body;

        const candidateByUsername = await User.findOne({ username });

        if (candidateByUsername) {
            return res.status(409).json({
                message: 'Користувач з таким іменем вже існує',
            });
        }

        if (email) {
            const candidateByEmail = await User.findOne({ email });

            if (candidateByEmail) {
                return res.status(409).json({
                    message: 'Користувач з таким email вже існує',
                });
            }
        }

        const hashPassword = bcrypt.hashSync(password, 7);

        const user = new User({
            username,
            password: hashPassword,
            email,
            firstName,
            lastName,
            phone,
            city,
            roles: ['USER'],
        });

        await user.save();

        const token = generateAccessToken(user._id, user.roles);

        return res.status(201).json({
            token,
            user: getSafeUser(user),
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: 'Register error',
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                message: 'Невірне імʼя користувача або пароль',
            });
        }

        const token = generateAccessToken(user._id, user.roles);

        return res.json({
            token,
            user: getSafeUser(user),
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: 'Login error',
        });
    }
};

const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'Користувача не знайдено',
            });
        }

        return res.json({
            user,
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: 'Me error',
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json({
            message: 'Get users error',
        });
    }
};

const updateMe = async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            phone,
            city,
            avatar,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'Користувача не знайдено',
            });
        }

        if (email && email !== user.email) {
            const candidateByEmail = await User.findOne({ email });

            if (
                candidateByEmail &&
                String(candidateByEmail._id) !== String(user._id)
            ) {
                return res.status(409).json({
                    message: 'Користувач з таким email вже існує',
                });
            }
        }

        user.email = email || undefined;
        user.firstName = firstName ?? user.firstName;
        user.lastName = lastName ?? user.lastName;
        user.phone = phone ?? user.phone;
        user.city = city ?? user.city;
        user.avatar = avatar ?? user.avatar;

        await user.save();

        return res.status(200).json({
            message: 'Профіль оновлено',
            user: getSafeUser(user),
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: 'Update profile error',
        });
    }
};

module.exports = {
    registration,
    login,
    me,
    getUsers,
    updateMe,
};
