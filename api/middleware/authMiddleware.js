const jwt = require('jsonwebtoken');

const User = require('../models/user_model');
const { secret } = require('../config');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Користувач не авторизований',
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Користувач не авторизований',
            });
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select('roles isBlocked blockedReason');

        if (!user) {
            return res.status(401).json({
                message: 'Користувач не авторизований',
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: user.blockedReason || 'Ваш акаунт заблоковано адміністратором',
            });
        }

        req.user = {
            id: String(user._id),
            roles: user.roles || [],
        };

        return next();
    } catch (e) {
        return res.status(401).json({
            message: 'Користувач не авторизований',
        });
    }
};