const {Membership, Employee } = require("../models")
const { Member } = require("../models/member.model")
const { employeeValidation } = require("../validation")
const { mailUtil, idGenerator } = require("../utils");


const approveMembership = async (body, user) => {
    try {
        const { phone } = user

        const { message, membershipStatus, memberPhone } = body

         // joi input validation
         const { error } = employeeValidation.approveMembershipValidationSchema.validate({...body})

         // return error if input validation fails
         if(error) {
             return {success:false, message:error.message}
         }

        // find membership for given member in database
        const membershipData = await Membership.findOne({"member.phone":memberPhone})

        if(!membershipData) {
            return {success:false, message:"No membership with given number"}
        }

        // if current approver is not a approver for given membership then return response
        if(membershipData.approver.phone != phone) {
            return {success:false, message:"You are not a approver for given membership"}
        }

        let membershipId;
        if(membershipStatus == "approved") {
            membershipId = await idGenerator.generateID(membershipData.typeOfMembership.toLowerCase())
            console.log("id: ", membershipId)
            membershipData.membershipId = membershipId
        }

        // approve membership if it is in pending or reverted status
        if(membershipData.membershipStatus == "pending" || membershipData.membershipStatus == "reverted"){
            membershipData.approver.message = message
            membershipData.membershipStatus = membershipStatus
            membershipData.save()

            if(membershipStatus == "approved" || membershipStatus == "rejected"){
                // update completed membership in employee collection
                await Employee.findOneAndUpdate({phone}, {$inc : {completedMemberships : 1}})
            }

            if(membershipStatus == "approved"){
                // make member as approved in member collection
                await Member.findOneAndUpdate({'phone':membershipData.member.phone}, {isApproved: true})
            }

            let to = membershipData.member.email
            let subject;
            let mailBody;

            if(membershipStatus == "approved"){
                subject = "Congratulations! Your Membership Request Has Been Approved"
                mailBody = `Dear ${membershipData.member.firstName + " " + membershipData.member.lastName},

                We are delighted to inform you that your membership request for ERDA has been successfully approved! Welcome to our community of members.
                Membership ID: ${membershipId}
                As an approved member, you now have access to our exclusive features, including the ability to use our chat service, access our magazine, and explore our laboratory resources. We believe these exclusive features will greatly enhance your experience with us.
                
                Your commitment to joining our organization is greatly appreciated, and we look forward to your active participation.
                
                Once again, congratulations, and thank you for choosing to be a part of our organization.
                
                Best regards,
                Team ERDA`
            } else if (membershipStatus == "rejected") {
                subject = "Notice: Membership Request Rejected"
                mailBody = `Dear ${membershipData.member.firstName + " " + membershipData.member.lastName},

                We regret to inform you that your recent membership request at ERDA has been reviewed and, unfortunately, cannot be approved at this time.
                
                We appreciate your interest in our organization and encourage you to reevaluate your application in the future or reach out to us if you have any questions or concerns.
                
                Reason for Rejection: ${message}
                
                If you have any questions or require further clarification, please do not hesitate to reach out to our member services team at sem7idp@gamil.com. We are here to assist you throughout the process.
                
                Thank you for considering us, and we wish you the best in your endeavors.
                
                Sincerely,
                Team ERDA`
            } else if(membershipStatus == "reverted") {
                subject = "Request for Reverting Membership: Action Required"
                mailBody = `Dear ${membershipData.member.firstName + " " + membershipData.member.lastName},

                We hope this message finds you well. We would like to bring to your attention that, upon review, your membership at ERDA is slated for reversion based on certain criteria.
                
                Reason for revert: ${message}
                
                We encourage you to review your application thoroughly and address the mentioned points to increase the likelihood of a successful approval.

                If you have any questions or require further clarification, please do not hesitate to reach out to our member services team at sem7idp@gamil.com. We are here to assist you throughout the process.

                Thank you for your dedication to becoming a member of [Organization Name], and we look forward to receiving your updated application.
                
                Best regards,
                Team ERDA`
            }

            await mailUtil.sendMail(to, subject, mailBody)

            return {success:true, message:`Membership ${membershipStatus} successfully`}
        }

        return {success:false, message:"You cannot approve already approved or draft staged membership"}

    } catch (error) {
        return {success:false, message:"Internal server error", data:error.message}
    }
}




module.exports = {
    approveMembership
}