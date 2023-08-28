// import of models (database schema)
const { Membership } = require("../models");

// validation schema import
const { membershipValidation } = require("../validation");

// image related services import
const { uploadFile, getObjectSignedUrl } = require("./image.service")

// POST API - company-info-1
const companyBasicInfo = async (body, user) => {
    try {
        // retrive data from body of the request
        const { companyPhone, companyEmail, companyTelephone, companyName, ownerName, companyAddress } = body;

        // joi input validaton
        const { error } = membershipValidation.membershipCompanyInfo1ValidationSchema.validate({ companyPhone, companyEmail, companyTelephone, companyName, ownerName, companyAddress})

        // validation error condition
        if(error){
            return {success:false, message:"Input validation failed", data: error.message}
        }

        // there can be updation in previous data
        const previousmemberShipData = await Membership.findOne({'member.phone':user.phone})

        // if membership with given mobile number already exists, then update data into it.
        if(previousmemberShipData){

            // when membership is in pending or approved status, data cannot be updated or added
            if(previousmemberShipData.membershipStatus == "pending"){
                return { success: false, message:"Application is in approval stage, cannot modify data"}
            }
            else if(previousmemberShipData.membershipStatus == "approved"){
                return { success: false, message:"Application is already approved, can not modify data now."}
            }

            // updation in previous data
            previousmemberShipData.companyPhone = companyPhone
            previousmemberShipData.companyEmail = companyEmail
            previousmemberShipData.companyTelephone = companyTelephone
            previousmemberShipData.companyName = companyName
            previousmemberShipData.ownerName = ownerName
            previousmemberShipData.companyAddress = companyAddress

            // save updated data in database
            previousmemberShipData.save()

            // return sucess response
            return { success:true, message:"Membership data updated successfully"}
        }

        // new member creation condition
        // create membership object as per schema requirment
        const initialMembershipData = {
            member:user,
            ...body,
            membershipFormStatus:"company-info-1"
        }

        // create membership in database
        await Membership.create(initialMembershipData)

        // return success response
        return { success: true, message:"Data Added succesfully"}
    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const companyInfoTwo = async (body, user, file) => {
    try {
        // retrive data from body
        const { companyType, registrationYear, panNumber, cinNumber, gstNumber, registrationProofName } = body;

        // joi input validation
        const { error } = membershipValidation.membershipCompanyInfo2ValidationSchema.validate({ companyType, registrationYear, panNumber, cinNumber, gstNumber, registrationProofName })

        // if error in input, then return response
        if(error){
            return {success:false, message:"Input validation failed", data: error.message}
        }

        // fetch previously added membership info
        const membershipData = await Membership.findOne({"member.phone":user.phone})

        // if no previous membership then return response
        if(!membershipData) {
            return { success: false, message:"No membership for given member", data: membershipData }
        }

        // when membership is in pending or approved status, data cannot be updated or added
        if(membershipData.membershipStatus == "pending"){
            return { success: false, message:"Application is in approval stage, cannot modify data"}
        }
        else if(membershipData.membershipStatus == "approved"){
            return { success: false, message:"Application is already approved, can not modify data now."}
        }
        
        // membership data updation condition
        if(membershipData.membershipFormStatus == "company-info-2" || membershipData.membershipFormStatus == "company-info-3" || membershipData.membershipFormStatus == "member-info") {

            // change membership data accodingly 
            membershipData.companyType = companyType
            membershipData.companyRegistrationYear = registrationYear
            membershipData.panNumber = panNumber
            membershipData.cinNumber = cinNumber
            membershipData.gstNumber = gstNumber
            membershipData.companyRegistrationProofAttachment = {
                file: membershipData.companyRegistrationProofAttachment.file,
                documentName:registrationProofName
            }

            if(file){
                // todo: IT IS NECESSARY TO FIRST DELETE THE PREVIOUS FILE
                // file updation condition
                const uploadedImageResponse = await uploadFile(file, registrationProofName)
                membershipData.companyRegistrationProofAttachment = {
                    file: uploadedImageResponse.imageURL,
                    documentName: membershipData.companyRegistrationProofAttachment.documentName
                }
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
        const { companyERDAObjective, companyERDARequiredServices, typeOfMembership, companyTurnOverRange, companyProducts } = body

        // joi input validation
        const { error } = membershipValidation.membershipCompanyInfo3ValidationSchema.validate({ companyERDAObjective, companyERDARequiredServices, typeOfMembership, companyTurnOverRange, companyProducts})
        if(error){
            return {success:false, message:"Input validation failed", data: error.message}
        }

        const membershipData = await Membership.findOne({"member.phone":user.phone})

        // if no membership with given phone number then return response
        if(!membershipData) {
            return { success: false, message:"No membership for given member", data: membershipData }
        }

        // when membership is in pending or approved status, data cannot be updated or added
        if(membershipData.membershipStatus == "pending"){
            return { success: false, message:"Application is in approval stage, cannot modify data"}
        }
        else if(membershipData.membershipStatus == "approved"){
            return { success: false, message:"Application is already approved, can not modify data now."}
        }

        // data updation condition
        if(membershipData.membershipFormStatus == "company-info-3"){
            // membershipData.companyResearchArea = companyResearchArea
            membershipData.companyERDAObjective = companyERDAObjective
            membershipData.companyERDARequiredServices = companyERDARequiredServices
            membershipData.typeOfMembership = typeOfMembership
            membershipData.companyTurnOverRange = companyTurnOverRange
            membershipData.companyProducts = JSON.parse(companyProducts)
            membershipData.membershipStatus = "pending"

            if(file){
                // initial data addition conditon
                const uploadedImageResponse = await uploadFile(file, "turnover-balance-sheet")
                membershipData.turnOverBalanceSheet = uploadedImageResponse.imageURL
            }


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
            membershipFormStatus:"company-info-3",
            membershipStatus : "pending"
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

// pagination of membership data
const getMemberships = async (query) => {
    try {
        let { page, limit } = query;

        // if page is not there in query of page is < 0 then set page as 1
        if(!page || page <= 0){
            page = 1;
        }
        
        // if limit is not there in query of limit is < 0 then set limit as 1
        if(!limit || limit <= 0){
            limit = 1;
        }

        // count total number of documents for perticular type of user
        const totalMembershipCount = await Membership.countDocuments({});

        // count last page for pagination
        const lastPage = Math.ceil(totalMembershipCount / limit)

        // if requested page is not exists of exceed the total count 
        if (page != lastPage && (page * limit) > totalMembershipCount + 1) {
            return { sucess:false, "message": "reached to the end of the membership data" }
        }

        // find users as par pagination requirment
        const memberships = await Membership.find({}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
        
        // return users data
        return {success:true, message:`All Memberships`, data: {memberships: memberships, totalPages: lastPage, totalDocuments: totalMembershipCount, currentPage: page}}
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