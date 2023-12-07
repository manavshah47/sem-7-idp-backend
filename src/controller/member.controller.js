const { memberService } = require("../services")


// error page just to show user not exists with given user credentials
const errorPage = async (req, res) => {
    const errorPageResponse = await memberService.errorPage()
    res.json(errorPageResponse)
}


const createMember = async (req, res) => {
    const createdMemberResponse = await memberService.createMember(req.body)
    res.json(createdMemberResponse)
}


const sendEmail = async (req, res) => {
    const emailSentResponse = await memberService.sendEmail(req.body)
    res.json(emailSentResponse)
}

const memberDashboard = async (req, res) => {
    const memberDashboardResponse = await memberService.memberDashboard(req.user)
    res.json(memberDashboardResponse)
}

const magazineDashboard = async (req, res) => {
    const magazineDashboardResponse = await memberService.magazineDashboard(req.user)
    res.json(magazineDashboardResponse)
}

module.exports = {
    errorPage,
    createMember,
    sendEmail,
    memberDashboard,
    magazineDashboard
}