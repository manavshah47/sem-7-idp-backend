// express import and router initialization
const express = require("express");
const router = express.Router()

const passport = require("passport")

const { logoutUser } = require("../middleware/auth.middleware")
const { ensureMember } = require("../middleware/user.middleware")

const { employeeController } = require("../controller");

// 1. user login route
router.post("/login", passport.authenticate('local', {failureRedirect: '/api/user/error' }), employeeController.login)

// 2. user info route (extra)
router.get("/show-user-info", ensureMember, employeeController.showUserInfo)

// 3. user logout route
router.get("/logout", logoutUser, employeeController.logout)

// dummy route to showcase user not exists with given credentials
router.get("/error", employeeController.errorPage)

module.exports = router