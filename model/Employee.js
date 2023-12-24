const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    // An id field is automatically created so don't need one in schema
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
})

// *** The first argument for mongoose.model will be the CAPITALIZED and SINGULAR name of the collection. Ex: Our collection is named employees in MongoDB, so the first argument is Employee***
module.exports = mongoose.model('Employee', employeeSchema);