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
            body: `ERDA Member verification code: ${otp} (valid till 10 minutes)`,
            from: '+1 218 748 1407',
            to: `+91${phone}`
        })

        return {success:true, message: "Message sent successfully"}

    } catch (error) {
        return {sucess:false,data: error.message}
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

const createMember = async (body) => {
    try {
        // firstName, lastName, email, phone (from body)

        // joi input validation
        const { error } = userValidation.createUserValidationSchema.validate({ ...body })

        // return error if input validation fails
        if(error) {
            return {success:false, message : error.message}
        }

        let { email, ...rest } = body

        const memberId = await membershipIdGenerator()

        const memberData = {
            email: email.toLowerCase(),
            ...rest,
            memberId
        }

        await Member.create(memberData)

        const otpResponse = await sendOtp({phone:body.phone})
        
        if(!otpResponse.success){
            return { success:false, message:"Member created, but cannot send otp", data: otpResponse.data }
        }

        return { success:true, message:"Member Created successfully" }
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
    checkEmailExist
}