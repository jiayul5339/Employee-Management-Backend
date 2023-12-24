const User = require('../model/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({'message': 'No users were found'});
    return res.json(users)
}

const updateUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({'Message': "ID parameter is required"});
    const user = await User.findOne({_id : req.body.id}).exec();

    if(req.body.username) user.username = req.body.username;
    if(req.body.roles) user.roles = req.body.roles;
    if(req.body.password) {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword
    }
    const result = await user.save()
    console.log(result)
    return res.status(200).json(result)
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({"Messgae": "ID parameter is required"});
    const user = await User.findOne({_id : req.body.id}).exec();

    if (!user) return res.status(200).json({"Message": "No user found with that ID"});
    const result = await user.deleteOne({_id: req.body.id})
    return res.status(200).json(result)
}

module.exports = {getAllUsers, updateUser, deleteUser}