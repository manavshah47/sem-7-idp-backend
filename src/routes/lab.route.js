const express = require("express");
const router = express.Router()

const passport = require("passport")


const { ensureAuthenticated } = require("../middleware/auth.middleware");
const { labController } = require("../controller");

router.post("/book-lab", ensureAuthenticated, labController.bookLab)

router.post("/check-date-availiability", ensureAuthenticated, labController.checkDateWiseAvailibility)

router.post("/check-time-availiability", ensureAuthenticated, labController.checkTimeWiseAvailibility)

router.get("/member-bookings", ensureAuthenticated, labController.memberYearlyData)

module.exports = router