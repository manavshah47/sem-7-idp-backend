// express import and router initialization
const express = require("express");
const router = express.Router()

const passport = require("passport")

const { ensureMagazineManager } = require("../middleware/user.middleware")
const { ensureAuthenticated } = require("../middleware/auth.middleware")
const { magazineController } = require("../controller");

router.post("/upload-magazine", ensureMagazineManager, magazineController.uploadMagazine)

router.get("/get-magazines", ensureAuthenticated, magazineController.getMagazines)

router.post("/send-magazine", ensureAuthenticated, magazineController.sendMagazineViaMail)

module.exports = router