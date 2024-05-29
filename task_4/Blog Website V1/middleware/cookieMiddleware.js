const cookieParser = require('cookie-parser');

module.exports = function(req, res, next) {
    if (!req.cookies.cookieConsent) {
        res.cookie('showCookiePrompt', true, { httpOnly: false });
    } else {
        res.clearCookie('showCookiePrompt');
    }
    next();
};
