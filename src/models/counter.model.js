const mongoose = require("mongoose");

// counter model schema
const counterSchema = new mongoose.Schema({
    counter: {
        type: Number
    },

    type: {
        type: String
    }
});

// create counter model from counter schema
const Counter = mongoose.model("counter", counterSchema);

// export counter model
module.exports = Counter;
