const mongoose = require("mongoose");

// employee schema
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    employeeId : {
        type : String
    },
    
    department: {
        type: String,
        enum: ["hey", "by"],
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

    typeOfUser: {
        type: String,
        enum: ["approver", "magazine-manager"],
        required: true
    },

    pendingMemberships: {
        type: Number,
        default: 0
    }
});

// create employee model from user schema
const Employee = mongoose.model("employee", employeeSchema);

// employee model export
module.exports = Employee;
