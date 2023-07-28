const mongoose = require("mongoose");

// member schema
const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    
    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    
    phone: {
        type: String,
        required: true,
        unique: true
    },

    otp: {
        type: String
    },

    typeOfUser: {
        type: String,
        default: "member"
    }


});

// create member model from user schema
const Member = mongoose.model("member", memberSchema);

// member model export
module.exports = Member;
