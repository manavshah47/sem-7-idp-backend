// joi (npm package) is used here for input validation
const Joi = require("joi")

// email  schema
const email = Joi.string().email().required().messages({'any.only':'Enter a valid email'});

// username schema
const username = Joi.string().min(3).max(30).required().messages({'string.empty':'Username cannot be empty', 'string.min':'username cannot be less than 3 characters','string.max':'username cannot be more than 30 characters'});

// password schema
const password = Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).messages({'any.only':"Password must be 6-16 characters long and must contain 1 capital, 1 lowercase and 1 special character."});

// typeOfUser schema
const typeOfUser = Joi.string().valid('creator', 'legal', 'finance').messages({'any.only':'Please select type of user from one of these'})

// validation schema for create user api
const createUserValidationSchema = Joi.object({
    id:email,
    name: username,
    password,
    typeOfUser
});

// validation schema for login user api
const logInValidationSchema = Joi.object({
    email,
    password
});


// email validation schema for delete user, check email with user exists
const emailValidationSchema = Joi.object({
    id:email
})


// validation schema for update user
const updateUserValidationSchema = Joi.object({
    id:email,
    name: username, 
    password
})

module.exports = {
    createUserValidationSchema,
    logInValidationSchema,
    emailValidationSchema,
    updateUserValidationSchema
}