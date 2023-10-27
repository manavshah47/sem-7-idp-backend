// express import and router initialization
const express = require("express");
const router = express.Router()

const passport = require("passport")

const { logoutUser, ensureAuthenticated } = require("../middleware/auth.middleware")
const { ensureMember } = require("../middleware/user.middleware")

const { authController, membershipController } = require("../controller");

// 1. user login route
router.post("/login", passport.authenticate('member', {failureRedirect: 'https://erda-membership-management.netlify.com/api/member/error' }), authController.login)

// 3. user logout route
router.get("/logout", logoutUser, authController.logout)

// send otp api
router.post("/send-otp", authController.sendOtp)

//create phone check
router.get("/check-phone/:phone",authController.checkPhoneExist)

//create email check
router.get("/check-email/:email",authController.checkEmailExist)

router.get("/show-current-user", ensureAuthenticated, authController.showUserData)

router.post("/update-profile-image", ensureAuthenticated, authController.uploadProfileImage)

router.post("/get-profile-image", ensureAuthenticated, authController.getProfileImage)

module.exports = router