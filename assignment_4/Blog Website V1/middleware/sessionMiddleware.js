const session = require('express-session');
const crypto = require('crypto');

// Generate random string for session secret
const generateRandomString = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

module.exports = session({
    secret: generateRandomString(32),
    resave: false,
    saveUninitialized: true
});
