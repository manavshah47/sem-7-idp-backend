const { membershipService, memberService } = require('../services')

const companyBasicInfo = async (req, res) => {
    const companyBasicInfoResponse = await membershipService.companyBasicInfo(req.body, req.user)
    res.json(companyBasicInfoResponse)
}


const companyInfoTwo = async (req, res) => {
    const companyInfoResponse = await membershipService.companyInfoTwo(req.body, req.user, req.files)
    res.json(companyInfoResponse)
}

const companyInfoThree = async (req, res) => {
    const companyInfoThreeResponse = await membershipService.companyInfoThree(req.body, req.user, req.files)
    res.json(companyInfoThreeResponse)
}

const memberInfo = async (req, res) => {
    const memberInfoResponse = await membershipService.memberInfo(req.body, req.user)
    res.json(memberInfoResponse)
}

const getMemberships = async (req, res) => {
    const membershipData = await membershipService.getMemberships(req.query)
    res.json(membershipData)
}

const getMemberShipData =  async (req, res) => {
    const membershipData = await membershipService.getMemberShipData(req.params)
    res.json(membershipData)
}

module.exports = {
    companyBasicInfo,
    companyInfoTwo,
    companyInfoThree,
    memberInfo,
    getMemberships,
    getMemberShipData
}