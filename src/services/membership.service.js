const { Membership } = require("../models")
const { uploadFile } = require("./image.service")

const companyBasicInfo = async (body, user) => {
    try {
        
        // there can be updation in previous data
        // const previousmemberShipData = await Membership.findOne({'member.phone':user.phone})
        // if(previousmemberShipData){
        //     return { success:false, message:"Membership for current user already exists"}
        // }

        const initialMembershipData = {
            member:user,
            ...body,
            membershipFormStatus:"company-info-1"
        }

        await Membership.create(initialMembershipData)

        return { success: true, message:"Data Added succesfully"}

    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const companyInfoTwo = async (body, user, file) => {
    try {
        const membershipData = await Membership.findOne({"member.phone":user.phone})

        if(!membershipData) {
            return { success: false, message:"No membership for given member", data: membershipData }
        }

        const { companyType, companyRegistrationYear, panNumber, cinNumber, gstNumber, registrationProofName } = body;
        
        // member can add updated data
        // if(membershipData.membershipFormStatus == "company-info-2") {
        //     return { success: false, message:"Membership company info already added", data: membershipData }
        // }

        const uploadedImageResponse = await uploadFile(file, registrationProofName)

        const updatedMembershipData = {
            companyType, companyRegistrationYear, panNumber, cinNumber, gstNumber,
            companyRegistrationProofAttachment: {
                file: uploadedImageResponse.imageURL,
                documentName: registrationProofName
            },
            membershipFormStatus:"company-info-2"
        }

        const updatedData = await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData}, {returnOriginal:false})

        return { success: true, message:"Company Info added successfully"}

    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const companyInfoThree = async (body, user, file) => {
    try {
        const membershipData = await Membership.findOne({"member.phone":user.phone})

        if(!membershipData) {
            return { success: false, message:"No membership for given member", data: membershipData }
        }

        // member can add updated data
        // if(membershipData.membershipFormStatus == "company-info-3" ) {
        //     return { success: false, message:"Membership company info already added", data: membershipData }
        // }

        if(membershipData.membershipFormStatus == "company-info-1" ) {
            return { success: false, message:"Please add company info 2 first", data: membershipData }
        }

        const { companyResearchArea, companyERDAObjective, companyERDARequiredServices, typeOfMembership, companyTurnOverRange, companyTurnOver, companyProducts } = body

        const uploadedImageResponse = await uploadFile(file, "turnover-balance-sheet")

        const updatedMembershipData = {
            companyResearchArea, companyERDAObjective, typeOfMembership, companyTurnOverRange, companyTurnOver, companyProducts, companyERDARequiredServices,
            turnOverBalanceSheet: uploadedImageResponse.imageURL,
            membershipFormStatus:"company-info-3"
        }

        await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData})

        return { success: true, message:"Company Info added successfully"}

    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const memberInfo = async (body, user) => {
    try {
        const membershipData = await Membership.findOne({"member.phone":user.phone})

        if(!membershipData) {
            return { success: false, message:"No membership for given member", data: membershipData }
        }
        

        if(membershipData.membershipFormStatus == "company-info-1" ) {
            return { success: false, message:"Please add company info 2 first", data: membershipData }
        }
        
        if(membershipData.membershipFormStatus == "company-info-2" ) {
            return { success: false, message:"Please add company info 3 first", data: membershipData }
        }
        
        const updatedMembershipData = {
            ...body,
            membershipFormStatus:"member-info"
        }

        await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData})

        return { success: true, message:"member Info added successfully"}

    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const getMemberships = async () => {
    try {
        const membershipData = await Membership.find({})
        return {success: true, message:"Membership data", data:membershipData}
    } catch(error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

module.exports = {
    companyBasicInfo,
    companyInfoTwo,
    companyInfoThree,
    memberInfo,
    getMemberships
}