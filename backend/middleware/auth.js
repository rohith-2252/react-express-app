const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

function checkUser(req, res, next) {
    const token = req.cookies.ecommerce_token;
    req.user = false;

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch {
            req.user = false;
        }
    }
    next();
}

function mustBeLoggedIn(req, res, next) {
    if (req.user) return next();
    return res.status(401).json({ error: "Unauthorized" });
}

module.exports = { checkUser, mustBeLoggedIn };