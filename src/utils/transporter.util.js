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

module.exports = transporter