const jwt = require('jsonwebtoken');

// Add this to any page/route to protect it
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization; // Can be capitalized or not
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // If no authHeader or doesn't start with 'Bearer '
    console.log(authHeader); // Bearer token  <- how it will be formated, so we have to split the auth header to get token
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // Invaid token
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles
            next();
        }
    )
}

module.exports = verifyJWT