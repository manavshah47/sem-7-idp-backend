// express import and router initialization
const express = require("express");
const router = express.Router()

const { ensureMember, ensureApprover } = require("../middleware/user.middleware")

const { membershipController } = require("../controller");

// 1. company info 1
router.post("/company-info-1", ensureMember, membershipController.companyBasicInfo)

// 2. company info 2
router.put("/company-info-2", ensureMember, membershipController.companyInfoTwo)

// 3. company info 3
router.put("/company-info-3", ensureMember, membershipController.companyInfoThree)

// 4. member info
router.put("/member-info", ensureMember, membershipController.memberInfo)

// 5. get memberships
router.get("/get-memberships", membershipController.getMemberships)

// 6. get membership
router.get("/membership/:memberPhone", membershipController.getMemberShipData)

// 7. apply for membership route
router.put("/apply-for-membership", ensureMember, membershipController.applyForMembership)

module.exports = router