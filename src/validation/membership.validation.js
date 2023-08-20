// joi (npm package) is used here for input validation
const Joi = require("joi")

// companyPhone, companyEmail, companyTelephone, companyName, ownerName, companyAddress

// create membership validation schema
const membershipCompanyInfo1ValidationSchema = Joi.object({
    companyPhone: Joi.string().min(10).max(10).required().messages({'string.empty':'phone number no cannot be empty', 'string.min':'EQTR No cannot be less than 3 characters','string.max':'EQTR No cannot be more than 255 characters'}),
    companyEmail: Joi.string().email().required().messages({'string.empty':'title cannot be empty', 'string.min':'title cannot be less than 3 characters','string.max':'title cannot be more than 255 characters'}),
    companyTelephone: Joi.string().min(3).max(255).required().messages({'string.empty':'name cannot be empty', 'string.min':'name cannot be less than 3 characters','string.max':'name cannot be more than 255 characters'}),
    companyName: Joi.string().min(3).max(255).required().messages({'string.empty':'orderValue cannot be empty', 'string.min':'orderValue cannot be less than 3 characters','string.max':'orderValue cannot be more than 255 characters'}),
    ownerName: Joi.string().min(3).max(255).required().messages({'string.empty':'customer payment terms cannot be empty', 'string.min':'customer payment terms cannot be less than 3 characters','string.max':'customer payment terms cannot be more than 255 characters'}),
    companyAddress: Joi.string().min(3).max(255).required().messages({'string.empty':'company payment terms cannot be empty', 'string.min':'company payment terms cannot be less than 3 characters','string.max':'company payment terms cannot be more than 255 characters'}),
})


// companyType, registrationYear, panNumber, cinNumber, gstNumber, registrationProofName
const membershipCompanyInfo2ValidationSchema = Joi.object({
    companyType: Joi.string().min(3).max(200).required().messages({'string.empty':'phone number no cannot be empty', 'string.min':'EQTR No cannot be less than 3 characters','string.max':'EQTR No cannot be more than 255 characters'}),
    registrationYear: Joi.string().regex(/^[0-9]{4}$/).required().messages({'string.empty': 'Registration Year is required','string.pattern.base': 'Registration Year must be a valid year in YYYY format'}),  
    panNumber: Joi.string().min(10).max(10).required().messages({
        'string.empty': 'PAN Number cannot be empty',
        'string.min': 'PAN Number must be of 10 digit',
        'string.max': 'PAN Number must be of 10 digit'
    }),
    cinNumber: Joi.string().min(21).max(21).required().messages({
        'string.empty': 'CIN Number cannot be empty',
        'string.min': 'CIN Number must be of 21 digit',
        'string.max': 'CIN Number must be of 21 digit'
    }),
    gstNumber: Joi.string().min(15).max(15).required().messages({
        'string.empty': 'GST Number cannot be empty',
        'string.min': 'GST Number must be of 15 digit',
        'string.max': 'GST Number must be of 15 digit'
    }),
    registrationProofName: Joi.string().min(3).max(255).required().messages({
        'string.empty': 'Registration Proof Name cannot be empty',
        'string.min': 'Registration Proof Name cannot be less than 3 characters',
        'string.max': 'Registration Proof Name cannot be more than 255 characters'
    }),})

    //companyERDAObjective, companyERDARequiredServices, typeOfMembership, companyTurnOverRange, companyProducts
const membershipCompanyInfo3ValidationSchema = Joi.object({
    companyERDAObjective: Joi.string().min(5).max(200).required().messages({'string.empty':'objective cannot be empty', 'string.min':'objective should be atleast 5 character','string.max':'objective should be greater than 200 character'}),
    companyERDARequiredServices: Joi.string().min(5).max(200).required().messages({
        'string.empty': 'Services cannot be empty',
        'string.min': 'Services must be of 5 character',
        'string.max': 'Services must be of less than 200 character'
    }),  
    typeOfMembership: Joi.string().min(5).max(200).required().messages({
        'string.empty': 'Membership cannot be empty',
        'string.min': 'Membership must be of 5 character',
        'string.max': 'Membership must be of less than 200 character'
    }),
    companyTurnOverRange: Joi.string().min(2).max(200).required().messages({
        'string.empty': 'TurnOver cannot be empty',
        'string.min': 'TurnOver must be of atleast 2 digit',
        'string.max': 'TurnOver must be of atmost 200 digit'
    }),
    companyProducts: Joi.string().min(4).max(150).required().messages({
        'string.empty': 'Products cannot be empty',
        'string.min': 'Products must be of atleast 4 character',
        'string.max': 'Products must be of atlmost 150 character'
    })
})

    


module.exports = {
    membershipCompanyInfo1ValidationSchema,
    membershipCompanyInfo2ValidationSchema,
    membershipCompanyInfo3ValidationSchema
}