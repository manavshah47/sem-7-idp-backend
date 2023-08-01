const { Membership } = require("../models")


const companyBasicInfo = async (body, user) => {
    try {
        const previousmemberShipData = await Membership.findOne({'member.phone':user.phone})

        if(previousmemberShipData){
            return { success:false, message:"Membership for current user already exists"}
        }

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

const companyInfoTwo = async (body, user) => {
    try {
        const membershipData = await Membership.findOne({"member.phone":user.phone})

        if(!membershipData) {
            return { success: false, message:"No membership for given member", data: membershipData }
        }
        
        if(membershipData.membershipFormStatus == "company-info-2") {
            return { success: false, message:"Membership company info already added", data: membershipData }
        }

        const updatedMembershipData = {
            ...body,
            membershipFormStatus:"company-info-2"
        }

        const updatedData = await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData}, {returnOriginal:false})

        return { success: true, message:"Company Info added successfully"}

    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const companyInfoThree = async (body, user) => {
    try {
        const membershipData = await Membership.findOne({"member.phone":user.phone})

        if(!membershipData) {
            return { success: false, message:"No membership for given member", data: membershipData }
        }

        if(membershipData.membershipFormStatus == "company-info-3" ) {
            return { success: false, message:"Membership company info already added", data: membershipData }
        }
        if(membershipData.membershipFormStatus == "company-info-1" ) {
            return { success: false, message:"Please add company info 2 first", data: membershipData }
        }

        const updatedMembershipData = {
            ...body,
            membershipFormStatus:"company-info-3"
        }

        const updatedData = await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData}, {returnOriginal:false})

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
            return { success: false, message:"Membership company info already added", data: membershipData }
        }
        
        const updatedMembershipData = {
            ...body,
            membershipFormStatus:"member-info"
        }

        const updatedData = await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData}, {returnOriginal:false})

        return { success: true, message:"member Info added successfully"}

    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}


module.exports = {
    companyBasicInfo,
    companyInfoTwo,
    companyInfoThree,
    memberInfo
}