const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {

    // Check if origin is in allowedOrigins' list, we will set the header
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials