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

module.exports = {
    ensureMember
}