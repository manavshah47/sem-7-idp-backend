const { Otp } = require("../models");
const { Member } = require("../models/member.model");
const { membershipIdGenerator } = require("../util/IdGenerator");

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
            return {success:false, message:"Input validation failed", data:error.message}
        }

        const memberData = await Member.findOne({ phone })
        if(!memberData || memberData === null || memberData === undefined){
            return {success:false,message:"no member with given phone number"}
        }
        
        let otp = Math.floor(100000 + Math.random() * 900000);  //Generate 6 digit otp.
        otp = otp.toString();
        
        await Otp.create({phone, otp})

        const response = await client.messages
        .create({
            body: `member verification code: ${otp}`,
            from: '+1 218 748 1407',
            to: `+91${phone}`
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
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// show user info service
const showUserInfo = async (user) => {
    try{
        return {success:true, message:"Current user", data:user}
    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// logout user service
const logout = async (session) => {
    try{
        // destroy current user session
        session.destroy();
        return {success:true, message:"User successfully logged out"}
    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

const errorPage = async () => {
    return {success:false, message:"Incorrect Otp, send otp again."}
}

const createMember = async (body) => {
    try {
        // firstName, lastName, email, phone (from body)

        // joi input validation
        const { error } = userValidation.createUserValidationSchema.validate({ ...body })

        // return error if input validation fails
        if(error) {
            return {success:false, message:"Input validation failed", data:error.message}
        }

        const memberId = await membershipIdGenerator()

        const memberData = {
            ...body,
            memberId
        }

        await Member.create(memberData)

        const otpResponse = await sendOtp({phone:body.phone})
        
        if(!otpResponse.success){
            return { success:false, message:"Member created, but cannot send otp", data: otpResponse.data }
        }

        return { success:true, message:"Member Created successfully" }
    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

module.exports = {
    login,
    showUserInfo,
    logout,
    errorPage,
    sendOtp,
    createMember
}