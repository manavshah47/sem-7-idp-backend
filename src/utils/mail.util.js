require("dotenv").config()
const nodemailer = require("nodemailer");

const APP_PASSWORD = process.env.APP_PASSWORD

// creating transporter for mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "manavshah0407@gmail.com",
        pass: APP_PASSWORD,
    }
});


const sendMail = async (to, subject, body) => {
    try {
        // nodemailer package is used here to send data via mail
        const mail = {
            from: "manavshah0407@gmail.com",
            to, // receiver email
            subject,
            // html as main data of the mail
            html: body
        }
        transporter.sendMail(mail, (error) => {
            if (error) {
                return {response:false,message:"Cannot send email try again later"}
            } 
        })

        return {success:true, message: "Message sent successfully"}
    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}


module.exports = {
    sendMail
}