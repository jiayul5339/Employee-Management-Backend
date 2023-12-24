// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// };

const User = require('../model/User')

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    // Check if there is a cookie with a jwt property
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    // Check if user exists
    // const foundUser = usersDB.users.find((person) => person.refreshToken == refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);

            const accessToken = jwt.sign(
                {"UserInfo": {
                    "username": decoded.username,
                    "roles": roles
                }},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'} // Should be longer than 30s in production app
            )
            res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }