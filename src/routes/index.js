// all routes are routed from here
const express = require('express')
const router = express.Router()

// import admin routes
const adminRoute = require("./admin.route")

// import employee routes
const employeeRoute = require("./employee.route")

// import member routes
const memberRoute = require("./member.route")

// use /admin for admin routes
router.use("/admin", adminRoute)

// use /employee for user routes
router.use("/employee", employeeRoute)

// use /member for user routes
router.use("/member", memberRoute)

module.exports = router