const mongoose = require("mongoose");

// employee schema
const employeeSchema = new mongoose.Schema({
    code: {
        type:String,
        required:true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    password: {
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
    }
});

// create employee model from user schema
const Employee = mongoose.model("employee", employeeSchema);

// employee model export
module.exports = Employee;
