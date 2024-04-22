// passport strategy import
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
// Admin model import
const { Admin, Otp, Employee, Email } = require('../models')
const { Member } = require("../models/member.model")

const { userValidation } = require("../validation")

module.exports = function (passport) {
    // passport google strategy for admin users
    passport.use(
        'admin',
        // we are using google strategy as strategy
        new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/admin/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // find the admin in our database 
                let user = await Admin.findOne({ adminId: profile.id })

                if (user) {
                    // If admin present in our database.
                    done(null, user)
                } else {
                    //              CREATE NEW ADMIN                    
                    // const adminData = {
                    //     adminId: profile.id,
                    //     emailId: profile._json.email,
                    //     name: profile.displayName,
                    //     profileImage: profile._json.picture,
                    //      typeOfUser: "admin"
                    // }

                    // let admin = await Admin.create(adminData)
                    done(null, false)
                }
            } catch (err) {
                
            }
        })
    )

    // passport local strategy (for members as well as employee)
    passport.use('member',
        new LocalStrategy({
            usernameField: 'id',
            passwordField:'password'
        }, 
        async (id, password, done) => {

             // joi input validation
            const { error } = userValidation.logInValidationSchema.validate({ id, password })

            // return error if input validation fails
            if(error) {
                return done(null, false)
            }

            // const userData = await Member.findOne({phone:id})
            // if(!userData){
            //     return done(null, false)
            // }

            // const otpResponse = await Otp.findOne({phone:id, otp: password})
            const otpResponse = await Email.findOne({ email: id, otp: password })
            
            // if user not exists then show error message
            if(!otpResponse){
                return done(null, false)
            }

            let userData = await Member.findOne({email:id})
            if(userData == null) {
                userData = await Employee.findOne({email:id})
            }

            if(userData != null){
                // if user exists then start user session
                return done(null, userData)
            }
            // not a member and not a employee condition
            return done(null, false)
        }
        )
    )


    // called whenever user session starts
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    // called whenever new request occours for current session user
    passport.deserializeUser(async (user, done) => {
        // find current user from user database
        let currUser = await Member.findOne({email:user.email}).select({password:0, __v:0})
        if(currUser){
            done(null, currUser)
            return;
        }
        
        currUser = await Employee.findOne({email:user.email}).select({password:0, __v:0})
        if(currUser){
            done(null, currUser)
            return;
        }

        // find current user from admin database
        const admin = await Admin.findOne({adminId:user.adminId})
        done(null, admin)
        return;
        
    })
}