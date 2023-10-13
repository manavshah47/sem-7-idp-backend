// import of models (database schema)
const { Membership, Employee } = require("../models");
const { mailUtil } = require("../utils");

// validation schema import
const { membershipValidation } = require("../validation");

// image related services import
const { uploadPDFFile, getPDFSignedURL } = require("./image.service")

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
                const uploadedImageResponse = await uploadPDFFile(file, registrationProofName)
                membershipData.companyRegistrationProofAttachment = {
                    file: uploadedImageResponse,
                    documentName: membershipData.companyRegistrationProofAttachment.documentName
                }
            }

            membershipData.save();
            return { success: true, message:"Membership info updated successfully."}
        }

        // first time insertion of data condition
        const uploadedImageResponse = await uploadPDFFile(file, registrationProofName)

        const updatedMembershipData = {
            companyType, companyRegistrationYear:registrationYear, panNumber, cinNumber, gstNumber,
            companyRegistrationProofAttachment: {
                file: uploadedImageResponse,
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
            
            if(file){
                const uploadedImageResponse = await uploadPDFFile(file, "turnover-balance-sheet")
                membershipData.turnOverBalanceSheet = uploadedImageResponse
            }

            membershipData.save()
            return { success: true, message:"Membership data updates successfully"}
        }
        
        // initial data addition conditon
        const uploadedImageResponse = await uploadPDFFile(file, "turnover-balance-sheet")
        
        const updatedMembershipData = {
            // companyResearchArea, 
            companyERDAObjective, 
            typeOfMembership, 
            companyTurnOverRange, 
            companyProducts: JSON.parse(companyProducts), 
            companyERDARequiredServices: JSON.parse(companyERDARequiredServices),
            turnOverBalanceSheet: uploadedImageResponse,
            membershipFormStatus:"company-info-3",
        }
        // this will be done when user verifies info added.
        // membershipStatus : "pending"
        
        await Membership.findOneAndUpdate({"member.phone":user.phone}, {...updatedMembershipData})

        return { success: true, message:"Company Info added successfully"}

    } catch (error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const applyForMembership = async (user) => {
    try {
        const { phone } = user

        const membershipData = await Membership.findOne({'member.phone':phone})

        if(!membershipData) {
            return {success:false, message:"No Membership for given Member"}
        }

        if(membershipData.membershipFormStatus != "company-info-3"){
            return { success: false, message:"Enter required form details first, then apply for membership"}
        }
        
        if(membershipData.membershipStatus == "approved" || membershipData.membershipStatus == "rejected"){
            return { success: false, message:"You cannnot apply again for approved or rejected membership."}
        }
        
        if(membershipData.membershipStatus == "pending") {
            return { success: false, message:"You have already applied for membership."}
        }

        const approver = await Employee.findOne({typeOfUser:"approver"}).sort({totalMemberships:1})

        let to = approver.email
        let subject = `Membership request from ${membershipData.companyName}`
        let messageBody = `<body>
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                <p style="margin: 10px 0;"><strong>Dear ${approver.name},</strong></p>
                                <p style="margin: 10px 0;">New requests have been submitted for your review and approval. Your timely action on these requests is crucial to ensure smooth processing. Kindly log into the system and review the pending requests at your earliest convenience.</p>
                                <p style="margin: 10px 0;">Your prompt attention to these requests is greatly appreciated.</p>
                                <p style="margin: 10px 0;">Thank you for your dedication to this process.</p>
                                <p style="margin: 10px 0;">Sincerely,<br>TEAM ERDA</p>
                            </div>
                        </body>`

        // `Dear ${approver.name}, \n\tNew Request have been submitted for your review and approval. Your timely action on these requests is crucial to ensure smooth processing. Kindly log into the system and review the pending requests at your earliest convenience.

        // Your prompt attention to these requests is greatly appreciated.
        
        // Thank you for your dedication to this process.
        
        // Sincerely,
        // TEAM ERDA
        // `


        await mailUtil.sendMail(to, subject, messageBody)

        membershipData.membershipStatus = "pending"
        membershipData.approver.phone = approver.phone
        await membershipData.save()

        approver.totalMemberships = approver.totalMemberships + 1
        await approver.save()

        return { success:true, message:"Membership form submitted successfully"}
    } catch (error) {
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
const getMemberships = async (query, user) => {
    try {
        const { typeOfUser, phone } = user
        let { page, limit, type } = query;

        // if page is not there in query of page is < 0 then set page as 1
        if(!page || page <= 0){
            page = 1;
        }
        
        // if limit is not there in query of limit is < 0 then set limit as 1
        if(!limit || limit <= 0){
            limit = 1;
        }

        // count total number of documents for perticular type of user
        let totalMembershipCount = -1

        if(type == "all") {
            if(typeOfUser == "approver") {
                totalMembershipCount = await Membership.countDocuments({'approver.phone':phone})
            } else if(typeOfUser == "admin") {
                totalMembershipCount = await Membership.countDocuments({})
            }
        } else if(type == "pending") {
            if(typeOfUser == "approver"){
                totalMembershipCount = await Membership.countDocuments({'approver.phone': phone, 'membershipStatus': 'pending'});
                if(totalMembershipCount == 0){
                    return { success: false, message:"There is no pending membership for given approver", data: {memberships: [], totalPages: 0, totalDocuments: 0, currentPage: 1} }
                }
            } else if(typeOfUser == "admin") {
                totalMembershipCount = await Membership.countDocuments({'membershipStatus': 'pending'});
                if(totalMembershipCount == 0){
                    return { success: false, message:"There is no pending membership", data: {memberships: [], totalPages: 0, totalDocuments: 0, currentPage: 1} }
                }
            } else {
                return { success:false, message: "You are not allowed to view pending memberships" }
            }
        } else if (type == "completed") {
            if(typeOfUser == "approver"){
                totalMembershipCount = await Membership.countDocuments({'approver.phone': phone, 'membershipStatus': {$in : ['approved', 'rejected']}});
                if(totalMembershipCount == 0) {
                    return { success: false, message:"There is no completed membership for given approver", data: {memberships: [], totalPages: 0, totalDocuments: 0, currentPage: 1}}
                }
            } else if(typeOfUser == "admin") {
                totalMembershipCount = await Membership.countDocuments({'membershipStatus': {$in : ['approved', 'rejected']}});
                if(totalMembershipCount == 0) {
                    return { success: false, message:"There is no completed membership", data: {memberships: [], totalPages: 0, totalDocuments: 0, currentPage: 1}}
                }
            } else {
                return { success:false, message: "You are not allowed to view completed memberships" }
            }
        } else {
            return { success:false, message:"Please select proper type."}
        }

        if(totalMembershipCount == -1) {
            return { success:false, message:"No membership found" }
        }

        // count last page for pagination
        const lastPage = Math.ceil(totalMembershipCount / limit)

        // if requested page is not exists of exceed the total count 
        if (page != lastPage && (page * limit) > totalMembershipCount + 1) {
            return { sucess:false, "message": "reached to the end of the membership data" }
        }

        // find users as par pagination requirment
        let memberships =  []
        
        if(type == "all"){
            if(typeOfUser == "approver"){
                memberships = await Membership.find({'approver.phone':phone}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
            } else if( typeOfUser == "admin"){
                memberships = await Membership.find({}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
            }
        } else if (type == "pending") {
            if(user.typeOfUser == "approver"){
                memberships = await Membership.find({'approver.phone': user.phone, 'membershipStatus': 'pending'}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
            } else if (user.typeOfUser == "admin") {
                memberships = await Membership.find({'membershipStatus': 'pending'}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
            }
        } else if(type == "completed") {
            if(user.typeOfUser == "approver"){
                memberships = await Membership.find({'approver.phone': user.phone, 'membershipStatus': {$in : ['approved', 'rejected']}}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
            } else if (user.typeOfUser == "admin") {
                memberships = await Membership.find({'membershipStatus': {$in : ['approved', 'rejected']}}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
            }
        }
        

        // return users data
        return {success:true, message:`All Memberships`, data: {memberships: memberships, totalPages: lastPage, totalDocuments: totalMembershipCount, currentPage: page}}
    } catch(error){
        return { success:false, message:"Internal server error", data:error.message }
    }
}

const getMemberShipData = async (params) => {
    try {
        const { memberPhone } = params

        let membershipData = await Membership.findOne({'member.phone':memberPhone})

        if(!membershipData){
            return { success: false, message:"No membership with given Id" }
        }
        
        const membershipStatus = membershipData.membershipFormStatus


        if(membershipStatus == "company-info-2" || membershipStatus == "company-info-3" || membershipStatus == "member-info"){
            let pdfURL = await getPDFSignedURL(membershipData.companyRegistrationProofAttachment.file)
            membershipData.companyRegistrationProofAttachment.file = pdfURL
        }
      
        if(membershipStatus == "company-info-3" || membershipStatus == "member-info"){
            let pdfURL = await getPDFSignedURL(membershipData.turnOverBalanceSheet)
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
    getMemberShipData,
    applyForMembership
}