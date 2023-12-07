const mongoose = require("mongoose");
const { memberSchema } = require("./member.model")

// membership schema
const membershipSchema = new mongoose.Schema({
    // company details 1
    companyName: {
        type: String,
        required: true
    },
    
    companyAddress: {
        type: String,
        required: true
    },
    
    ownerName: {
        type: String,
        required: true
    },
    
    companyTelephone: {
        type: String,
        required: true
    },
    
    companyPhone: {
        type: String,
        required: true
    },
    
    companyEmail: {
        type: String,
        required: true
    },

    companyBranch: {
        type: String
    },
    
    companyFactory: {
        type: String
    },


    // company details 2
    companyType: {
        type: String,
        // required: true
    },

    companyRegistrationYear: {
        type: Date
    },

    companyRegistrationProofAttachment: { // pdf attachment
        file : {
            type: String, // file name will look like (electricity/abc.pdf) || (address/abc.pdf)
        },

        documentName: {
            type: String // enum: ["electiry", "address"]
        }
    },
    
    panNumber: {
        type: String,
        // required: true
    },
    
    cinNumber: {
        type: String,
        // required: true
    },
    
    gstNumber: {
        type: String,
        // required: true
    },
    
    companyOtherNumber: {
        type: String,
        // required: true
    },


    // company details 3
    companyResearchArea: { // enum
        type: [String],
        // required: true
    },

    companyProducts: [{
        productName: {
            type:String,
            // required:true,
        },
        
        productUnit: {
            type:String,
            // required:true,
        },
        
        productCapacity: {
            type:String,
            // required:true,
        }
    }],

    companyERDAObjective: {
        type: String,
        // required: true
    },

    companyERDARequiredServices: {
        type: [String],
        // required: true
    },

    typeOfMembership: {
        type: String, // assosiate, ordinary
        // required: true
    },

    companyTurnOverRange: { /// ordinary
        type: String,
        // required: true
    },

    companyTurnOver: {
        type: String,
        // required: true
    },

    turnOverBalanceSheet: { // pdf attachment
        type: String, 
        // required: true
    },


    // personal details (member)
    member: {
        type: memberSchema,
        required:true,
        unique:true,
    },
    
    memberDesignation: {
        type: String,
        // required: true
    },
    
    memberAddress: {
        type: String,
        // required: true
    },

    membershipFormStatus: {
        type: String,
        enum: ["company-info-1", "company-info-2", "company-info-3", "member-info"],
        required: true
    },

    membershipStatus: {
        type: String,
        enum: ["draft","pending", "reverted", "approved", "rejected"],
        default: "draft"
    },

    approver: {
        phone: {
            type: String
        },
        message: {
            type: String
        }
    },

    paymentStatus: {
        type: Boolean,
        default: false
    },

    membershipId: {
        type: String
    }

});

// create member model from user schema
const Membership = mongoose.model("membership", membershipSchema);

// member model export
module.exports = Membership;
