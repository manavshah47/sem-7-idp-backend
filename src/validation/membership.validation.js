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

    


module.exports = {
    membershipCompanyInfo1ValidationSchema,
}