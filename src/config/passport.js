// passport strategy import
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
// Admin model import
const { Admin, Otp } = require('../models')
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
                console.log("Admin Authentication Called")
                // find the admin in our database 
                let user = await Admin.findOne({ adminId: profile.id })

                if (user) {
                    // If admin present in our database.
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (err) {
                console.log(err)
            }
        })
    )

    // passport local strategy (for employee)
    passport.use('employee',
        new LocalStrategy({
                usernameField: 'id',
                passwordField:'password'
            }
            , async (id, password, done) => {
                // find user in database based on their id and password
                let emailId = id.toLowerCase();

                const userData = await Member.findOne({id: emailId, password}).select({password:0, __v:0, _id:0, otp:0});

                // if user not exists then show error message
                if(!userData){
                    return done(null, false)
                }

                // if user exists then start user session
                return done(null, userData)
            }
        )
    )

    // passport local strategy (for members)
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

            const userData = await Member.findOne({phone:id})
            if(!userData){
                return done(null, false)
            }

            const otpResponse = await Otp.findOne({phone:id, otp: password})

            // if user not exists then show error message
            if(!otpResponse){
                return done(null, false)
            }

            // if user exists then start user session
            return done(null, userData)
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
        const currUser = await Member.findOne({phone:user.phone}).select({password:0, __v:0, _id:0})
        if(currUser){
            done(null, currUser)
        }

        // find current user from admin database
        else {
            const admin = await Admin.findOne({adminId:user.adminId})
            done(null, admin)
        }
    })
}