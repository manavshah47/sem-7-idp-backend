const { Otp, Email } = require("../models");
const { transporter, membershipIdGenerator } = require("../util");

const { Member } = require("../models/member.model")

// send otp service
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const { userValidation } = require("../validation")

const sendOtp = async (body) => {
    try {
        const { phone } = body

        // joi input validation
        const { error } = userValidation.phoneNumberValidationSchema.validate({phone})

        // return error if input validation fails
        if(error) {
            return {success:false, message:error.message}
        }

        const memberData = await Member.findOne({ phone })
        if(!memberData || memberData === null || memberData === undefined){
            return {success:false,message:"no member with given phone number"}
        }
        
        let otp = Math.floor(100000 + Math.random() * 900000);  //Generate 6 digit otp.
        otp = otp.toString();
        
        // delete otp if already present
        await Otp.findOneAndDelete({phone})

        // store new otp in database
        await Otp.create({phone, otp})

        // send sms message via twilio
        const response = await client.messages
        .create({
            body: `\nHi ${memberData.firstName + " " + memberData.lastName}, 
            We're implementing two-step verification for your ERDA'S MEMBERSHIP account sign in. 
            Your verification code is ${otp}. 
            Please use this code within 10 minutes to complete the process. 
            Keep your account safe!`,
            from: '+1 218 748 1407',
            to: `+91${phone}`
        })

        return {success:true, message: "Message sent successfully"}

    } catch (error) {
        return {sucess:false,data: error.message}
    }
}

const sendEmail = async (body) => {
    try {
        const { email, firstName, lastName } = body

        // joi input validation
        const { error } = userValidation.emailValidationSchema.validate({email})

        // return error if input validation fails
        if(error) {
            return {success:false, message:"Enter a valid Email Id", data:error.message}
        }
        
        let otp = Math.floor(100000 + Math.random() * 900000);  //Generate 6 digit otp.
        otp = otp.toString();

        // delete otp if already present
        await Email.findOneAndDelete({email})

        // store new otp in email database
        await Email.create({email, otp})

        let htmlMessage =  (
            `<body>
                <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <div class="header" style="background-color: #0f3c69; color: #ffffff; text-align: center; padding: 10px 0; border-top-left-radius: 5px; border-top-right-radius: 5px;">
                        <h1>Email Verification</h1>
                    </div>
                    <h3><strong>Hi ${firstName + " " + lastName},</strong></h3>
                    <p>Thank you for signing up with ERDA. To complete your account verification, please use the following verification code:</p>
                    <p><strong>Verification Code:</strong> ${otp}</p>
                    <p>This code will expire in 10 Minutes.</p>
                    <p>If you didn't initiate this request, please disregard this message.</p>
                    <p>Thank you, \n 
                    Team ERDA </p>
                </div>
            </body>`
        )

        // nodemailer package is used here to send data via mail
        const mail = {
            from: "manavshah0407@gmail.com",
            to: email, // receiver email
            subject: `ERDA'S MEMBERSHIP MANAGEMENT`,
            // html as main data of the mail
            html: htmlMessage
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

// login user service
const login = async (user) => {
    try{
        return {success:true, message:"User logged In successfully", data:user}
    } catch (error) {
        return {sucess:false,message:error.message}
    }
}

// show user info service
const showUserInfo = async (user) => {
    try{
        return {success:true, message:"Current user", data:user}
    } catch (error) {
        return {sucess:false,message:error.message}
    }
}

// logout user service
const logout = async (session) => {
    try{
        // destroy current user session
        session.destroy();
        return {success:true, message:"User successfully logged out"}
    } catch (error) {
        return {sucess:false,message:error.message}
    }
}

const errorPage = async () => {
    return {success:false, message:"Wrong OTP, Enter correct OTP."}
}

const verifyOtp = async (email, otp) => {
    try {

        const response = await Email.findOne({ email, otp })

        if(!response) {
            return false;
        }

        return true;

    } catch (error) {
        return false
    }
}

const createMember = async (body) => {
    try {
        // firstName, lastName, email, phone (from body)

        // joi input validation
        const { error } = userValidation.createUserValidationSchema.validate({ ...body })

        // return error if input validation fails
        if(error) {
            return {success:false, message : error.message}
        }

        const { firstName, lastName, email, phone, otp } = body;

        const response = await verifyOtp(email, otp)

        if(response) {
            const memberId = await membershipIdGenerator()
    
            const memberData = {
                firstName,
                lastName,
                email,
                phone,
                memberId
            }
    
            await Member.create(memberData)
    
            return { success:true, message:"Member Created successfully" }
        } else {
            return { success: false, message: "Enter OTP again." }
        }
    } catch (error) {
        return {sucess:false,message: error.message}
    }
}

const checkPhoneExist = async (params) => {
    try {
        const {phone} = params
        const user = await Member.findOne({phone})
        if(user){
            return {success : true, exists:true}
        }else{
            return {success : true, exists:false}

        }
    } catch (error) {
        return {sucess:false,message: error.message}
    }
}

const checkEmailExist = async (params) => {
    try {
        let {email} = params
        email = email.toLowerCase()
        const user = await Member.findOne({email})
        if(user){
            return {success : true, exists:true}
        }else{
            return {success : true, exists:false}

        }
    } catch (error) {
        return {sucess:false,message: error.message}
    }
}


module.exports = {
    login,
    showUserInfo,
    logout,
    errorPage,
    sendOtp,
    createMember,
    checkPhoneExist,
    checkEmailExist,
    sendEmail
}