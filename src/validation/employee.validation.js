// joi (npm package) is used here for input validation
const Joi = require("joi")

// email  schema
const email = Joi.string().email().required().messages({'any.only':'Enter a valid email'});

// username schema
const name = Joi.string().min(2).max(30).required().messages({'string.empty':'Username cannot be empty', 'string.min':'username cannot be less than 3 characters','string.max':'username cannot be more than 30 characters'});

// phone validation schema
const phone = Joi.string().regex(/^[0-9]{10}$/).message({'any.only':'Invalid mobile number format'}).required();

// department validation schema 
const department = Joi.string().valid("hey", "by").required().messages({'string.empty':'Department cannot be empty'});

// designation validation schema 
const designation = Joi.string().valid("manager","employee").required().messages({'string.empty':'designation cannot be empty'});

// type validation schema 
const typeOfUser = Joi.string().valid("approver", "magazine-manager").required().messages({'string.empty':'type cannot be empty'});


// validation schema for create user api
const createEmployeeValidationSchema = Joi.object({
    name,
    email,
    phone,
    department,
    designation,
    typeOfUser
});



module.exports = {
    createEmployeeValidationSchema
}