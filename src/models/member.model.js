const mongoose = require("mongoose");

// member schema
const memberSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        unique: true
    },
    
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

    typeOfUser: {
        type: String,
        default: "member"
    },

    isApproved: {
        type: Boolean,
        default: false
    }
});

// create member model from user schema
const Member = mongoose.model("member", memberSchema);

// member model export
module.exports = {
    Member,
    memberSchema
};
