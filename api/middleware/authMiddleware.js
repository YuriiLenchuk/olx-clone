const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = (req, res, next) => {
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

        req.user = jwt.verify(token, secret);

        return next();
    } catch (e) {
        return res.status(401).json({
            message: 'Користувач не авторизований',
        });
    }
};