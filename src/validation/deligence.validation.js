// joi (npm package) is used here for input validation
const Joi = require("joi")

// create deligence validation schema
const createDeligenceValidationSchema = Joi.object({
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

const financeDeligenceInfoValidationSchema = Joi.object({
    riskLevel: Joi.string().valid('low', 'moderately low', 'moderate', 'moderate high', 'high').messages({'any.only':'Please select risk level from one of these'}),
    observationSummary: Joi.string().min(3).max(255).messages({'string.max':'observation summary cannot be more than 255 characters', 'string.min':'observation cannot be less than 3 characters'}), 
    conclusion: Joi.string().min(3).max(255).messages({'string.max':'conclusion cannot be more than 255 characters', 'string.min':'conclusion cannot be less than 3 characters'}), 
    notes: Joi.string().min(3).max(255).messages({'string.max':'notes cannot be more than 255 characters', 'string.min':'notes cannot be less than 3 characters'}), 
    recomandedPaymentTerms: Joi.string().min(3).max(255).messages({'string.max':'recomanded payment terms cannot be more than 255 characters', 'string.min':'recomanded payment terms cannot be less than 3 characters'}), 
    deligenceId: Joi.string().min(24).max(24).messages({'string.max':'deligenceId must be exact 24 characters', 'string.min':'deligene id must be exact 24 characters long'})
})

const legalDeligenceInfoValidationSchema = Joi.object({
    comment: Joi.string().min(3).max(255).messages({'string.max':'comment cannot be more than 255 characters', 'string.min':'comment cannot be less than 3 characters'}),
    deligenceId: Joi.string().min(24).max(24).messages({'string.max':'deligenceId must be exact 24 characters', 'string.min':'deligene id must be exact 24 characters long'})
})

const eqtrNoValidationSchema = Joi.object({
    no: Joi.string().min(3).max(255).required().messages({'string.empty':'EQTR No cannot be empty', 'string.min':'EQTR No cannot be less than 3 characters','string.max':'EQTR No cannot be more than 255 characters'})
})

module.exports = {
    createDeligenceValidationSchema,
    financeDeligenceInfoValidationSchema,
    legalDeligenceInfoValidationSchema,
    eqtrNoValidationSchema
}