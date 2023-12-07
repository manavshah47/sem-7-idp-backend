const { membershipService } = require('../services')

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
    const membershipData = await membershipService.getMemberships(req.query, req.user)
    res.json(membershipData)
}

const getMemberShipData =  async (req, res) => {
    const membershipData = await membershipService.getMemberShipData(req.params)
    res.json(membershipData)
}

const applyForMembership = async (req, res) => {
    const appliedMembershipResponse = await membershipService.applyForMembership(req.user)
    res.json(appliedMembershipResponse)
}

module.exports = {
    companyBasicInfo,
    companyInfoTwo,
    companyInfoThree,
    memberInfo,
    getMemberships,
    getMemberShipData,
    applyForMembership
}