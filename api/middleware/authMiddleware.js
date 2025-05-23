// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') next();

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(403).json({ message: 'Користувач не авторизований' });
        res.user = jwt.verify(token, secret);
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({ message: 'Користувач не авторизований' });
    }
};
