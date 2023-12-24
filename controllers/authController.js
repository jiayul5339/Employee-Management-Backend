// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// };
const User = require('../model/User')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const fsPromises = require('fs').promises;
// const path = require('path')

const handleLogin = async (req, res) => {
    // Check if received a username and password
    const { user, password } = req.body;
    if (!user || !password ) return res.status(400).json({ 'message': 'Username and password are required.'});

    // Check if user exists
    // const foundUser = usersDB.users.find((person) => person.username == user);
    const foundUser = await User.findOne({ username: user })
    if (!foundUser) {
        return res.status(401); // Unauthorized
    }

    // Check if password is correct
    const match = await bcrypt.compare(password, foundUser.password);

    if(match) {
        // Retrieve the user roles from foundUser 
        const roles = Object.values(foundUser.roles);

        // Create JWTs (Allows us to remember user is logged in and gain access to protect routes)
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' } // Dictates the amount of time before token expires
        );
        
        // Refresh tokens are to verify that you can keep getting new access tokens upon refresh
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } // Dictates the amount of time before token expires
        );
        
        // Saving refresh token with current user
        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);// Create an array of users that are not the one logged in
        // const currentUser = { ...foundUser, refreshToken };
        // usersDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // )
        // Set user's refresh token to the newly created refresh token
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result)

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }) // Storing refresh token as cookie is vulnerable because anyone can access the javascript file, this is counterd by setting cookie to httpOnly and time of cookie
        res.json({ accessToken });
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
}

module.exports = { handleLogin }