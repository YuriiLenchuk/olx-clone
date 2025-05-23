// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

// eslint-disable-next-line consistent-return
module.exports = roles => {
    // eslint-disable-next-line consistent-return
    return (req, res, next) => {
        if (req.method === 'OPTIONS') next();

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'Користувач не авторизований' });
            const { role: userRoles } = jwt.verify(token, secret);
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) hasRole = true;
            });
            if (!hasRole) return res.status(401).json({ message: 'У вас недостатньо прав' });
            next();
        } catch (e) {
            console.log(e);
            return res.status(401).json({ message: 'Користувач не авторизований' });
        }
    };
};
