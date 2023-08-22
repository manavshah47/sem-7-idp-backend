// express import and router initialization
const express = require("express");
const router = express.Router()

const passport = require("passport")

const { logoutUser } = require("../middleware/auth.middleware")
const { ensureMember } = require("../middleware/user.middleware")

const { memberController } = require("../controller");

// 1. user login route
router.post("/login", passport.authenticate('member', {failureRedirect: 'http://localhost:3001/api/member/error' }), memberController.login)

// 2. user info route (extra)
router.get("/show-member-info", ensureMember, memberController.showUserInfo)

// 3. user logout route
router.get("/logout", logoutUser, memberController.logout)

// dummy route to showcase user not exists with given credentials
router.get("/error", memberController.errorPage)

// send otp api
router.post("/send-otp", memberController.sendOtp)

// create member post request
router.post("/create-member", memberController.createMember)

//create phone check
router.get("/check-phone/:phone",memberController.checkPhoneExist)

//create email check
router.get("/check-email/:email",memberController.checkEmailExist)


module.exports = router