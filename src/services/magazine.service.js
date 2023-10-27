const { Magazine } = require("../models")
const { employeeValidation } = require("../validation")
const { uploadPDFFile, getPDFSignedURL } = require("./image.service")
const { mailUtil } = require("../utils");

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

const sendMagazineViaMail = async (body, user) => {
    try {
        const { name, file, author } = body.magazine
        
        let subject = `Digital copy of Magazine: ${name}`
        let mailBody = `<body>
                    <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <div class="header" style="background-color: #0f3c69; color: #ffffff; text-align: center; padding: 10px 0; border-top-left-radius: 5px; border-top-right-radius: 5px;">
                            <h1>Magazine: ${name} By ${author}</h1>
                        </div>
                        <p style="margin: 10px 0;">Your engagement with Magasine ${name} by author ${author} is truly appreciated, and we hope you find this digital issue as enriching as its print counterpart.</p>
                        <p style="margin: 10px 0;">Thank you for your trust in us.</p>
                        <p style="margin: 10px 0;">Best regards,<br>Team ERDA</p>
                    </div>
                </body>`

        await mailUtil.sendMail(user.email, subject, mailBody, file)

        return {success:true, message:`Magazine mailed sucessfully`}

    } catch (error) {
        return {success:false, message:"Internal server error", data:error.message}
    }
}

module.exports = {
    uploadMagazine,
    getMagazines,
    sendMagazineViaMail
}