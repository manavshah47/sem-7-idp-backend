const mongoose = require("mongoose");

// otp schema
const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },

    otp: {
        type: String
    },
    expire_at: {type: Date, default: Date.now, expires: 3600}
});

// create otp model from user schema
const Otp = mongoose.model("otp", otpSchema);

// otp model export
module.exports = Otp
