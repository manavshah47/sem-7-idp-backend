// express import and router initialization
const express = require("express");
const router = express.Router()

const { memberController } = require("../controller");

// dummy route to showcase user not exists with given credentials
router.get("/error", memberController.errorPage)

// create member post request
router.post("/create-member", memberController.createMember)

// send email route
router.post("/send-email", memberController.sendEmail)

// member dashboard 
router.get("/dashboard", memberController.memberDashboard)

// magazine-manager dashboard
router.get("/magazine-manager-dashboard", memberController.magazineDashboard)


module.exports = router