const {Membership, Employee } = require("../models")
const { Member } = require("../models/member.model")
const { employeeValidation } = require("../validation")

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