const mongoose = require("mongoose");

// employee schema
const employeeSchema = new mongoose.Schema({
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
        enum: ["management", "logistics", "inventory"],
        required: true
    },
    
    designation: {
        type: String,
        enum: ["manager", "employee"],
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
        enum: ["approver", "manager", "logistics"],
        required: true
    }
});

// create employee model from user schema
const Employee = mongoose.model("employee", employeeSchema);

// employee model export
module.exports = Employee;
