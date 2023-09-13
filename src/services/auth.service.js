const { Otp, Email, Employee } = require("../models");
const { transporter, membershipIdGenerator } = require("../utils");

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
            return {success:false, message:"Enter valid phone number"}
        }

        const memberData = await Member.findOne({ phone })
        const employeeData = await Employee.findOne({phone})

        if(memberData == null && employeeData == null){
            return {success:false,message:"No user with given phone number"}
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
            body: `\nHi ${memberData ? (memberData.firstName + " " +  + memberData.lastName) : employeeData?.name},
            \nWe're implementing two-step verification for your ERDA'S MEMBERSHIP account sign in.
            \nYour verification code is ${otp}.
            \nPlease use this code within 10 minutes to complete the process. 
            \nKeep your account safe!`,
            from: '+16463511965',
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

const checkPhoneExist = async (params) => {
    try {
        const {phone} = params
        const memberWithPhone = await Member.findOne({phone})
        const employeeWithPhone = await Employee.findOne({phone})
        
        if(memberWithPhone || employeeWithPhone){
            return {success : true, exists:true}
        } else {
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
        const memberWithEmail = await Member.findOne({email})
        const employeeWithEmail = await Member.findOne({email})
        if(memberWithEmail || employeeWithEmail){
            return {success : true, exists:true}
        }else{
            return {success : true, exists:false}
        }
    } catch (error) {
        return {sucess:false,message: error.message}
    }
}


// show current logged in user
const showUserData = async (user) => {
    try{
        return {success:true, message:"Current user", data:user}
    } catch (error) {
        return {sucess:false,message:error.message}
    }
}


module.exports = {
    login,
    logout,
    sendOtp,
    checkPhoneExist,
    checkEmailExist,
    showUserData
}