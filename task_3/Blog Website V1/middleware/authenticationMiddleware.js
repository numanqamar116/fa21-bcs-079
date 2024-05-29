module.exports = function(req, res, next) {
    res.locals.isAuthenticated = req.session.user ? true : false;
    next();
};
