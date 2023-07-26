// guest user middleware
const ensureGuest = (req, res, next) => {
    if(!req.isAuthenticated()){
        return next();
    }
    else {
        res.json({success:false, message:"User is currently logged in, logout first"});
    }
}

// middleware to ensure authenticated users are requesting
const ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    else {
        res.json({success:false, message:"User is not logged in, logIn first"});
    }
}


// middleware to logout user
const logoutUser = (req,res,next) => {
    req.logout((err) => {
        if(err){
            // if error occurs then errors page is there to handle it
            res.redirect('/error')
        }
        // logout user confirmation message is sent in next
        next()
    })
}

module.exports = {
    ensureGuest,
    logoutUser,
    ensureAuthenticated
}