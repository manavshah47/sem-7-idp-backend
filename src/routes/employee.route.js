// express import and router initialization
const express = require("express");
const router = express.Router()

const passport = require("passport")

const { ensureApprover } = require("../middleware/user.middleware")

const { employeeController } = require("../controller");

router.put("/approve-membership", ensureApprover, employeeController.approveMembership)

router.get("/dashboard", ensureApprover, employeeController.employeeDashboard)

module.exports = router