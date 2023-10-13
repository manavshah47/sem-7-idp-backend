const { Magazine } = require("../models")
const { employeeValidation } = require("../validation")
const { uploadPDFFile, getPDFSignedURL } = require("./image.service")

// bluebird promise - used for asynchronous promise handling while uploading multiple files in s3 at same time
const Promise = require('bluebird')

const uploadMagazine = async (body, user, file) => {
    try {
        // joi input validation
        const { error } = employeeValidation.uploadMagazineValidationSchema.validate({...body})

        // return error if input validation fails
         if(error) {
            return {success:false, message:error.message}
        }

        const { magazineName, magazineDescription, magazineAuthor, magazinePrice, magazinePages, magazineStock, magazineDate } = body;

        console.log("page: ", magazinePages)

        // upload magazine on s3
        const uploadedMagazineURL = await uploadPDFFile(file, "magazine")

        const objectAsPerMagazineModel = {
            name: magazineName,
            description: magazineDescription,
            author: magazineAuthor,
            date: magazineDate,
            price: magazinePrice,
            stock: magazineStock,
            page:magazinePages,
            file: uploadedMagazineURL,
            magazineManager: user.phone
        }

        // store data in database
        await Magazine.create(objectAsPerMagazineModel)

        return { success: true, message: "Magazine created successfully" }

    } catch (error) {
        return {success:false, message:"Internal server error", data:error.message}
    }
}

const getMagazines = async () => {
    try {
        let magazines = await Magazine.find({}).sort({date:-1})

        if(magazines.length == 0){
            return { success: false, message:"No magazines exists in the system" }
        }

        await Promise.map(magazines, async (magazine, index) =>  {
            let pdfURL = await getPDFSignedURL(magazine.file)
            magazines[index].file = pdfURL
        })


        return {success: true, data: magazines}

    } catch (error) {
        return {success:false, message:"Internal server error", data:error.message}
    }
}

module.exports = {
    uploadMagazine,
    getMagazines
}