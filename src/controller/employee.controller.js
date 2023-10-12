const { employeeService } = require("../services")

// approve membership controller
const approveMembership = async (req, res) => {
    const approvedMembershipResponse = await employeeService.approveMembership(req.body, req.user)
    res.json(approvedMembershipResponse)
}

// upload magazine controller
const uploadMagazine = async (req, res) => {
    const uploadedMagazineResponse = await employeeService.uploadMagazine(req.body, req.user, req.files)
    res.json(uploadedMagazineResponse) 
}

module.exports = {
    approveMembership,
    uploadMagazine
}