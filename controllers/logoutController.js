// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// };
// const fsPromises = require('fs').promises;
// const path = require('path');
const User = require('../model/User')

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies
    // Check if there is a cookie with a jwt property
    if (!cookies?.jwt) return res.sendstatus(401); // No content
    const refreshToken = cookies.jwt;

    // Is refresh token in database?
    // const foundUser = usersDB.users.find((person) => person.refreshToken == refreshToken);
    // Find user in database whose refresh Token matches the cookies refresh token
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}) // Clear cookie that was found despite not having a user, but be inputted with the same options that it was set with
        return res.status(204);
    }

    // Delete refresh token in database
    // const otherUsers = usersDB.users.filter((person) => person.refreshToken != foundUser.refreshToken);
    // const currentUser = { ...foundUser, refreshToken: '' }; // Clear the refresh token of that user
    // usersDB.setUsers([...otherUsers, currentUser]); // Merge them back into the database

    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(usersDB.users)
    // )
    // Set the user refresh token to '' and save it to database
    foundUser.refreshToken = ''
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    res.sendStatus(204);
}

module.exports = { handleLogout }