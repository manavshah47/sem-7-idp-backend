const { Email, Lab, Membership, Magazine, Employee } = require("../models");
const { mailUtil, idGenerator } = require("../utils");

const moment = require("moment")

const { Member } = require("../models/member.model")

const { userValidation } = require("../validation");

const sendEmail = async (body) => {
    try {
        const { email, isCreateRequest } = body

        // joi input validation
        const { error } = userValidation.emailValidationSchema.validate({email})

        // return error if input validation fails
        if(error) {
            return {success:false, message:"Enter a valid Email Id", data:error.message}
        }

        const memberData = await Member.findOne({ email })
        const employeeData = await Employee.findOne({ email })

        if(memberData == null && employeeData == null && !isCreateRequest){
            return {success:false,message:"No user with given mail id"}
        }
        
        let otp = Math.floor(100000 + Math.random() * 900000);  //Generate 6 digit otp.
        otp = otp.toString();

        // delete otp if already present
        await Email.findOneAndDelete({email})

        // store new otp in email database
        await Email.create({email, otp})

        const to = email
        const title = `ERDA'S MEMBERSHIP MANAGEMENT`
        const mailBody =  (
            `<body>
                <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <div class="header" style="background-color: #0f3c69; color: #ffffff; text-align: center; padding: 10px 0; border-top-left-radius: 5px; border-top-right-radius: 5px;">
                        <h1>Email Verification</h1>
                    </div>
                    <h3><strong>Welcome User,</strong></h3>
                    <p>Thank you for signing up with ERDA. To complete your account verification, please use the following verification code:</p>
                    <p>Verification Code: <strong> ${otp} </strong></p>
                    <p>This code will expire in 10 Minutes.</p>
                    <p>If you didn't initiate this request, please disregard this message.</p>
                    <p> Team ERDA </p>
                </div>
            </body>`
        )

        const response = await mailUtil.sendMail(to, title, mailBody)

        if(response.success) {
            return {success: true, message:"Mail sent successfully"}
        }

        return { sucess: false, message: "Error while sending mail"}

    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
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
            const memberId = await idGenerator.generateID("member")
    
            const memberData = {
                firstName,
                lastName,
                email,
                phone,
                memberId
            }
    
            const memberDataResponse = await Member.create(memberData)
    
            return { success:true, data: memberDataResponse, message:"Member Created successfully" }
        } else {
            return { success: false, message: "Enter OTP again." }
        }
    } catch (error) {
        return {sucess:false,message: error.message}
    }
}

const memberDashboard = async (user) => {
    try {
        const membership = await Membership.findOne({'member.phone': user.phone}).select({membershipId: 1, membershipStatus: 1})
        const bookings = await Lab.countDocuments({ memberPhone: user.phone })
        return { success: true, message:"Member dashboard response", data: { membership, bookings } }
    } catch (error) {
        return {sucess:false,message: error.message}
    }
}

const magazineDashboard = async (user) => {
    try {
        let currentDate = moment().format("YYYY-MM-DD")
        const previousMagazines = await Magazine.countDocuments({magazineManager: user.phone, date: {$lte:currentDate}})
        const upcomingMagazines = await Magazine.countDocuments({magazineManager: user.phone, date: {$gt: currentDate}})
        const totalMagazines = await Magazine.countDocuments({ magazineManager: user.phone })
        const magazines = await Magazine.find({ magazineManager: user.phone }).select({name: 1})
        
        return { success: true, message:"Magazine Manager dashboard response", data: { previousMagazines, upcomingMagazines, totalMagazines, magazines }}
    } catch (error) {
        return {sucess:false,message: error.message}
    }
}

module.exports = {
    errorPage,
    createMember,
    sendEmail,
    memberDashboard,
    magazineDashboard
}

