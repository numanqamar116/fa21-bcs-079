// Check if user is authenticated middleware
const checkAuth = (req, res, next) => {
    req.isAuthenticated = !!req.session.user;
    next();
};

module.exports = checkAuth;
