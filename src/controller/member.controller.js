const { memberService } = require("../services")


// show user info controller
const showUserInfo = async (req, res) => {
    const userInfo = await memberService.showUserInfo(req.user)
    res.json(userInfo)
}


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

module.exports = {
    showUserInfo,
    errorPage,
    createMember,
    sendEmail
}