const mongoose = require("mongoose");

// member schema
const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    department: {
        type: String,
        required: true
    },
    
    designation: {
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

    role: {
        type: [String],
        required: true
    },

    otp: {
        type: String
    }
});

// create member model from user schema
const Member = mongoose.model("member", memberSchema);

// member model export
module.exports = Member;
