// express import and router initialization
const express = require("express");
const router = express.Router()

const { ensureMember } = require("../middleware/user.middleware")
const { memberController } = require("../controller");

// 2. user info route (extra)
router.get("/show-member-info", ensureMember, memberController.showUserInfo)

// dummy route to showcase user not exists with given credentials
router.get("/error", memberController.errorPage)

// create member post request
router.post("/create-member", memberController.createMember)

// send email route
router.post("/send-email", memberController.sendEmail)

module.exports = router