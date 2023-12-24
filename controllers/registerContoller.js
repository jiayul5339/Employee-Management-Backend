// User authenication requires TWO paths, a registration path and an authentication path

// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// };

// Bringing in the User database
const User = require('../model/User');

// const fsPromises = require('fs').promises;
// const path = require('path');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, password, roles } = req.body;
    if (!user || !password ) return res.status(400).json({ 'message': 'Username and password are required.'})
    
    // CHECK FOR DUPLICATE USERNAMES
    // const duplicate = usersDB.users.find((person) => person.username === user)
    // Looking into User database to find one username that matches user that we got as a request. Need .exec() at end when paired with async await 
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.sendStatus(409);
    }

    // Create the new user and hash the password
    try {
        //Encrypt password with bcrypt. Insert the password and salt rounds (default 10)
        const hashedPassword = await bcrypt.hash(password, 10)

        // CREATE AND STORE NEW USER
        const result = await User.create({
            "username": user,
            "password": hashedPassword,
            "roles": roles
        });

        // ANOTHER WAY TO SAVE TO A DATABASE, THOUGH TOP METHOD IS EASIER
        // const newUser = new User();
        // newUser.username = user
        // newUser.password = hashedPassword
        // const result = await newUser.save()

        console.log(result);

        // const newUser = { 
        //     "username": user, 
        //     "roles": {
        //         "User": 2001
        //     },
        //     "password": hashedPassword 
        // };
        // usersDB.setUsers([...usersDB.users, newUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        // console.log(usersDB.users)
        
        res.status(201).json({ 'success': `New user ${user} created!` });

    } catch(err) {
        res.status(500).json({'message': err.message})
    }
}

module.exports = { handleNewUser }