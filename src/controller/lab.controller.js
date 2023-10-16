const { labService } = require("../services");

const bookLab = async (req, res) => {
    const labBookingResponse = await labService.bookLab(req.body, req.user)
    res.json(labBookingResponse)
}

const checkDateWiseAvailibility = async (req, res) => {
    const dateWiseResponse = await labService.checkDateWiseAvailibility(req.body)
    res.json(dateWiseResponse)
}

const checkTimeWiseAvailibility = async (req, res) => {
    const timeWiseResponse = await labService.checkTimeWiseAvailibility(req.body)
    res.json(timeWiseResponse)
}

const memberYearlyData =  async (req, res) => {
    const memberDataResponse = await labService.memberYearlyData(req.user)
    res.json(memberDataResponse)
}

module.exports = {
    bookLab,
    checkDateWiseAvailibility,
    checkTimeWiseAvailibility,
    memberYearlyData
}