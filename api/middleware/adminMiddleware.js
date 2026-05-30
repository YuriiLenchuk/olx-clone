module.exports = (req, res, next) => {
    if (Array.isArray(req.user?.roles) && req.user.roles.includes('ADMIN')) {
        return next();
    }

    return res.status(403).json({
        message: 'Доступ дозволено тільки адміністраторам',
    });
};