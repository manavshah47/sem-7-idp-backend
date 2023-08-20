// joi (npm package) is used here for input validation
const Joi = require("joi")

// create membership validation schema
const membershipCompanyInfo1ValidationSchema = Joi.object({
    eqtrNo: Joi.string().min(3).max(255).required().messages({'string.empty':'EQTR No cannot be empty', 'string.min':'EQTR No cannot be less than 3 characters','string.max':'EQTR No cannot be more than 255 characters'}),
    title: Joi.string().min(3).max(255).required().messages({'string.empty':'title cannot be empty', 'string.min':'title cannot be less than 3 characters','string.max':'title cannot be more than 255 characters'}),
    name: Joi.string().min(3).max(255).required().messages({'string.empty':'name cannot be empty', 'string.min':'name cannot be less than 3 characters','string.max':'name cannot be more than 255 characters'}),
    orderValue: Joi.string().min(3).max(255).required().messages({'string.empty':'orderValue cannot be empty', 'string.min':'orderValue cannot be less than 3 characters','string.max':'orderValue cannot be more than 255 characters'}),
    customerPaymentTerms: Joi.string().min(3).max(255).required().messages({'string.empty':'customer payment terms cannot be empty', 'string.min':'customer payment terms cannot be less than 3 characters','string.max':'customer payment terms cannot be more than 255 characters'}),
    companyPaymentTerms: Joi.string().min(3).max(255).required().messages({'string.empty':'company payment terms cannot be empty', 'string.min':'company payment terms cannot be less than 3 characters','string.max':'company payment terms cannot be more than 255 characters'}),
    address: Joi.string().min(3).max(255).messages({'string.max':'address cannot be more than 255 characters'}),
    customerType: Joi.string().valid('domestic', 'overseas').messages({'any.only':'Please select type of customer from one of these'}),
    country: Joi.string().valid('india', 'usa', 'canada', 'france', 'germany').messages({'any.only':'Please select country from one of these'})
})

    


module.exports = {
    membershipCompanyInfo1ValidationSchema,
}