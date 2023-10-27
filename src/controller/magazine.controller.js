const { magazineService } = require("../services")

// upload magazine controller
const uploadMagazine = async (req, res) => {
    const uploadedMagazineResponse = await magazineService.uploadMagazine(req.body, req.user, req.files)
    res.json(uploadedMagazineResponse) 
}

const getMagazines = async (req, res) => {
    const magazinesResponse = await magazineService.getMagazines()
    res.json(magazinesResponse)
}

const sendMagazineViaMail = async (req, res) => {
    const magazineSentResponse = await magazineService.sendMagazineViaMail(req.body, req.user)
    res.json(magazineSentResponse) 
}

module.exports = {
    uploadMagazine,
    getMagazines,
    sendMagazineViaMail
}