const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = roles => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') next();

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'Користувач не авторизований' });
            const { roles: userRoles } = jwt.verify(token, secret);
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
