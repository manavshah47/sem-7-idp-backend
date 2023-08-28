const mongoose = require("mongoose");

// email schema
const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    otp: {
        type: String
    },
    expire_at: {type: Date, default: Date.now, expires: 3600}
});

// create email model from user schema
const Email = mongoose.model("email", emailSchema);

// email model export
module.exports = Email
