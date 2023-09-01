const { Employee } = require("../models");
const { Member } = require("../models/member.model");

// middleware to ensure user is logged In
const ensureMember = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userId = req.user.id;
        const user = await Member.findOne({id:userId})
        if(user){
            // authenticated user
            return next();
        } else {
            // unauthorized user
            res.json({success:false, message:"User not logged In"});
        }

    } else {
        // unauthorized user
        res.json({success:false, message:"User not logged In"});
    }
}

// middleware to ensure approver is logged In
const ensureApprover = async (req, res, next) => {
    if (req.isAuthenticated()) {
        const userId = req.user.id;
        const approver = await Employee.findOne({id:userId, typeOfUser:"approver"})
        if(approver){
            // authenticated approver
            return next();
        } else {
            // unauthorized approver
            res.json({success:false, message:"Approver not logged In"});
        }

    } else {
        // unauthorized approver
        res.json({success:false, message:"Approver not logged In"});
    }
}

module.exports = {
    ensureMember,
    ensureApprover
}