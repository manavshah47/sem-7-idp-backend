const { Membership } = require("../models")
const { uploadFile, getObjectSignedUrl } = require("./image.service")

const companyBasicInfo = async (body, user) => {
    try {
        
        // there can be updation in previous data
        const previousmemberShipData = await Membership.findOne({'member.phone':user.phone})
        // if membership with given mobile number already exists, then update data into it.
        if(previousmemberShipData){
            const { companyPhone, companyEmail, companyTelephone, companyName, ownerName, companyAddress } = body;

            previousmemberShipData.companyPhone = companyPhone
            previousmemberShipData.companyEmail = companyEmail
            previousmemberShipData.companyTelephone = companyTelephone
            previousmemberShipData.companyName = companyName
            previousmemberShipData.ownerName = ownerName
            previousmemberShipData.companyAddress = companyAddress

            previousmemberShipData.save()

            return { success:true, message:"Membership data updated successfully"}
        }

        // new member creation procedure
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

        const { companyType, registrationYear, panNumber, cinNumber, gstNumber, registrationProofName } = body;
        
        // member can add updated data
        if(membershipData.membershipFormStatus == "company-info-2") {
            membershipData.companyType = companyType
            membershipData.companyRegistrationYear = registrationYear
            membershipData.panNumber = panNumber
            membershipData.cinNumber = cinNumber
            membershipData.gstNumber = gstNumber
            membershipData.companyRegistrationProofAttachment = {
                file: membershipData.companyRegistrationProofAttachment.file,
                documentName:registrationProofName
            }

            membershipData.save();
            return { success: true, message:"Membership info updated successfully."}
        }

        // first time insertion of data condition
        const uploadedImageResponse = await uploadFile(file, registrationProofName)

        const updatedMembershipData = {
            companyType, companyRegistrationYear:registrationYear, panNumber, cinNumber, gstNumber,
            companyRegistrationProofAttachment: {
                file: uploadedImageResponse.imageURL,
                documentName: registrationProofName
            },
            membershipFormStatus:"company-info-2"
        }

        await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData}, {returnOriginal:false})

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

        const { companyERDAObjective, companyERDARequiredServices, typeOfMembership, companyTurnOverRange, companyProducts } = body

        // data updation condition
        if(membershipData.membershipFormStatus == "company-info-3"){
            // membershipData.companyResearchArea = companyResearchArea
            membershipData.companyERDAObjective = companyERDAObjective
            membershipData.companyERDARequiredServices = companyERDARequiredServices
            membershipData.typeOfMembership = typeOfMembership
            membershipData.companyTurnOverRange = companyTurnOverRange
            membershipData.companyProducts = JSON.parse(companyProducts)

            membershipData.save()
            return { success: true, message:"Membership data updates successfully"}
        }

        // initial data addition conditon
        const uploadedImageResponse = await uploadFile(file, "turnover-balance-sheet")

        const updatedMembershipData = {
            // companyResearchArea, 
            companyERDAObjective, 
            typeOfMembership, 
            companyTurnOverRange, 
            companyProducts: JSON.parse(companyProducts), 
            companyERDARequiredServices: JSON.parse(companyERDARequiredServices),
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
        
        const updatedMembershipData = {
            ...body,
            membershipFormStatus:"member-info",
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

const getMemberShipData = async (params) => {
    try {
        const { memberId } = params

        let membershipData = await Membership.findOne({'member.memberId':memberId})

        if(!membershipData){
            return { success: false, message:"No membership with given Id" }
        }
        
        const membershipStatus = membershipData.membershipFormStatus


        if(membershipStatus == "company-info-2" || membershipStatus == "company-info-3" || membershipStatus == "member-info"){
            let pdfURL = await getObjectSignedUrl(membershipData.companyRegistrationProofAttachment.file)
            membershipData.companyRegistrationProofAttachment.file = pdfURL
        }
      
        if(membershipStatus == "company-info-3" || membershipStatus == "member-info"){
            let pdfURL = await getObjectSignedUrl(membershipData.turnOverBalanceSheet)
            membershipData.turnOverBalanceSheet = pdfURL
        }

        return { success: true, data: membershipData }

    } catch (error) {
        return { success:false, message:"Internal server error", data:error.message }
    }
}


module.exports = {
    companyBasicInfo,
    companyInfoTwo,
    companyInfoThree,
    memberInfo,
    getMemberships,
    getMemberShipData
}