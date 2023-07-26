const mongoose = require("mongoose");

// admin model schema
const adminSchema = new mongoose.Schema({
    adminId: {
        type:String,
        required:true,
        unique: true
    },

    emailId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    profileImage: {
        type: String
    },

    typeOfUser: {
        type: String
    }
});

// create admin model from admin schema
const Admin = mongoose.model("admin", adminSchema);

// export admin model
module.exports = Admin;
