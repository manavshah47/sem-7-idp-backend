const { Admin } = require("../models");

// middleware to ensure admin is logged in
const ensureAdmin = async (req,res,next) => {
    if (req.isAuthenticated()) {
        const adminId = req.user.adminId;
        const admin = await Admin.findOne({adminId})
        if(admin){
            // authenticated admin
            return next()
        } else {
            // unauthenticated user
            res.json({success:false, message:"Admin not logged In"});
        }
    } else {
        // unauthenticated user
        res.json({success:false, message:"Admin not logged In"});
    }
}

module.exports = {
    ensureAdmin
}
