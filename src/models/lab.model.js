const mongoose = require("mongoose");

// lab schema
const labSchema = new mongoose.Schema({
    memberPhone: {
        type: String,
        required: true
    },

    name : {
        type : String,
        required: true,
    },
    
    date: {
        type: String,
        required: true
    },
    
    time: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    }
});

// create lab model from user schema
const Lab = mongoose.model("lab", labSchema);

// lab model export
module.exports = Lab;
