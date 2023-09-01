const { employeeService } = require("../services")

// login user controller
const approveMembership = async (req, res) => {
    const approvedMembershipResponse = await employeeService.approveMembership(req.body, req.user)
    res.json(approvedMembershipResponse)
}


module.exports = {
    approveMembership
}