const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // An id field is automatically created so don't need one in schema
    username: {
        type: String,
        required: true
    },
    roles: {
        User:{
            type: Number,
            // If not specified, automatically assign user role of 2001 (Our basic user role)
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
})

// *** The first argument for mongoose.model will be the CAPITALIZED and SINGULAR name of the collection. Ex: Our collection is named users in MongoDB, so the first argument is User***
module.exports = mongoose.model('User', userSchema);