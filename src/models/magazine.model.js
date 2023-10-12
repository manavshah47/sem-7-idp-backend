const mongoose = require("mongoose");

// magazine schema
const magazineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description : {
        type : String
    },

    author : {
        type : String
    },
    
    date: {
        type: Date
    },
    
    price: {
        type: Number
    },

    stock: {
        type: Number
    },
    
    page: {
        type: Number
    },

    file: {
        type: String
    },

    magazineManager: {
        type: String,
        required: true
    }
});

// create magazine model from magazine schema
const Magazine = mongoose.model("magazine", magazineSchema);

// magazine model export
module.exports = Magazine;
