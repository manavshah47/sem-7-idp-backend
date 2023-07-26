// user model import
const { User } = require("../models")
const Joi = require("joi")
const { userValidation } = require("../validation")

// login admin service
const logIn = async (user) => {
    try{
        return {success:true,message:"admin loggedIn succcessfully", data:user}
    } catch(error){
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// show admin info service
const showAdminInfo = async (user) => {
    try{
        return {success:true, message:"admin info", data:user}
    } catch(error){
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// logout admin service
const logOut = async (session) => {
    try{
        session.destroy();
        return {success:true, message:"user logged out successfully"}
    } catch (error) {
        
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// create user service
const createUser = async (body) => {
    try{
        // destruct user data from body of the request
        const { id, name, password, typeOfUser } = body;

        // joi input validation
        const { error } = userValidation.createUserValidationSchema.validate({id, name, password, typeOfUser})
        
        // return error if input validation fails
        if(error) {
            return {success:false, message:"Input validation failed", data:error.message}
        }

        // create user data object as per schema requirment
        const userData = {
            id: id.toLowercase(),
            name,
            password,
            typeOfUser
        };

        // create user in backend
        const user = await User.create(userData);
        return {success:true, message:"User created successfully", data: user}
    } catch (error) {
        
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// show users with pagination
// query
// type -> type of user (creator, legal, finance)
// page -> current page
// limit -> number of document in single page
// ex. page = 3, limit = 5 will give 11-15 number documents
const showUsers = async (query) => {
    try{
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
        const totalUsersCount = await User.countDocuments({});

        // count last page for pagination
        const lastPage = Math.ceil(totalUsersCount / limit)

        // if requested page is not exists of exceed the total count 
        if (page != lastPage && (page * limit) > totalUsersCount + 1) {
            return { sucess:false, "message": "reached to the end of the users data" }
        }

        // find users as par pagination requirment
        const users = await User.find({}).sort({'updatedAt':-1,'createdAt':-1}).select({ __v: 0, password:0 }).limit(limit * 1).skip((page - 1) * limit).exec()
        
        // return users data
        return {success:true, message:`All Users`, data: {users: users, totalPages: lastPage, totalDocuments: totalUsersCount, currentPage: page}}
    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// delete user service
const deleteUser = async (params) => {
    try{
        // fetch user id from param
        const { id } = params;

        // joi input validation
        const { error } = userValidation.emailValidationSchema.validate({id})
        
        // return error if input validation fails
        if(error) {
            return {success:false, message:"Input validation failed", data:error.message}
        }

        // find user and delete
        const user = await User.findOneAndDelete({id});

        // if no user is there, means user does not exists
        if(!user){
            return {sucess:false, message: "No user with given id"}
        }

        // return response
        return {success:true, message:"User deleted successfully", data: user}
    } catch (error) {
        
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// update user service
const updateUser = async (body) => {
    try{
        // destruct user info from body of the request
        const { id, name, password } = body;

        // joi input validation
        const { error } = userValidation.updateUserValidationSchema.validate({id, name, password})
        
        // return error if input validation fails
        if(error) {
            return {success:false, message:"Input validation failed", data:error.message}
        }

        // find user and update its information
        const user = await User.findOneAndUpdate({id}, {name, password}, {returnOriginal: false});

        // if no user is there, means there is no user exists with given id
        if(!user){
            return {sucess:false, message: "No user with given id, cannot update"}
        }

        // return response
        return {success:true, message:"User updated successfully", data: user}
    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

// check user exists or not service
const checkExists = async (body) => {
    try{
        // fetch id (emailId) from body of the request
        const { id } = body;
        
        // joi input validation
        const { error } = userValidation.emailValidationSchema.validate({id})
        
        // return error if input validation fails
        if(error) {
            return {success:false, message:"Input validation failed", data:error.message}
        }


        // find user with given id (emailId)
        const userData = await User.findOne({id})
        
        // if user with given emailId exists, then we cannot create new user.
        if(userData){
            return {success:true, message:"User with given emailId exists", createUser: false}
        }

        // we can create user with given emailId as no user with given emailId is there
        return {success:true, message:"User can be created with given emailId", createUser: true}
    } catch (error) {
        return {sucess:false,message:"Internal server error", data: error.message}
    }
}

module.exports = {
    logIn,
    showAdminInfo,
    logOut,
    createUser,
    showUsers,
    deleteUser,
    updateUser,
    checkExists
}