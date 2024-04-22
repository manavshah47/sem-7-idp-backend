// joi (npm package) is used here for input validation
const Joi = require("joi")

// email  schema
const email = Joi.string().email().required().messages({'any.only':'Enter a valid email'});

// username schema
const username = Joi.string().min(2).max(30).required().messages({'string.empty':'Username cannot be empty', 'string.min':'username cannot be less than 3 characters','string.max':'username cannot be more than 30 characters'});

// phone validation schema
const phone = Joi.string().regex(/^[0-9]{10}$/).message({'any.only':'Invalid mobile number format'}).required()

// otp validation schema
const otp = Joi.string().regex(/^[0-9]{6}$/).message({'any.only':'Enter 6 digit OTP'}).required()

// validation schema for create user api
const createUserValidationSchema = Joi.object({
    firstName:username,
    lastName: username,
    email,
    phone,
    otp
});

// validation schema for login user api
const logInValidationSchema = Joi.object({
    id: email,
    password: otp
});


// email validation schema for delete user, check email with user exists
const phoneNumberValidationSchema = Joi.object({
    phone
})

const emailValidationSchema = Joi.object({
    email
})

module.exports = {
    createUserValidationSchema,
    logInValidationSchema,
    phoneNumberValidationSchema,
    emailValidationSchema
}