const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler');//handles mongoose error err
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); //for auth registration check


//requiresignin and isAuth methods are similar in operation
//difference is requiresignim allows you access resources if you are signed in
//isAuth takes it a step further and ensures you can't access someone else's records
//isAdmin ensures only admin can access admin resources
exports.signup = (req, res) => {
    
    User.findOne({email: req.body.email}).then(user => {
        //check if user already exists
        if(user){
            res.status(400).json({message: "Email already exists"});
        }else{
            //save user
            const newUser = new User(req.body);
            newUser.save((err, user) => {
                if(err){
                    return res.status(400).json({
                        err:errorHandler(err)
                    });
                }
                //all ok
                //hide salt and hashed-password from output
                user.salt = undefined;
                user.hashed_password = undefined;
        
                res.json({
                    user
                });
            });
        }
    });
    
   
};

//signin user -- issue a token to the user upon login
//token will be used to access protected routes
//token will be saved
exports.signin = (req, res) => {
    //find user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user){
            //user not found
            return res.status(400).json({
                err: "User does not exist, please sign up"
            });
        }
        //if user is found, ensure email and password match
        //user will enter plain paswrord, encrypt it 
        //with the encryptPassword method and compare

        //authenticate method is in user model -- it compares plain text password entered by user to hashed_password in db
        if(!user.authenticate(password)){
            //401 unauthorised
            return res.status(401).json({
                error: 'Email and password do not match'
            });
        }
        //generate signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        //persist token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999});
        //user is still available ath this point. 
        //return response with user and token to frontend client
        const {_id, name, email, role} = user;//retrieve data from user
        return res.json({token, user: {_id, email, name, role}})
    });
};


//signout, very easy -- it simply clears the cookie from the response
exports.signout = (req, res) => {
    //clear cookie
    res.clearCookie('t');//the cookie identified as 't'
    res.json({ message: "Signout success" });
};


//middleware method to protect routes
//it validates the token set on login and sets req.user
//Requires cookie-parser as to be installed before it can work
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});


//this middleware checks if it is the same user as the user currently logged in
/**
 * in absence of this:
 * Victor can login, and then he can see John's information if he has 
 * access to john's id. i.e userId passed to route param, 
 * which is what userById method handles in user.js controller
 * so, only john should have access to his profile information, no one else
 * that is what this middleware does
 */

 //req.profile is available when userId is in route param
    //req.profile: available after userById method runs when it detects userId in route param
    //req.auth: accessible after requireSignin runs above. it contains the user info (req.user)
    //req.profile._id: user id inside the profile returned when userById runs and assigns user object to req.profile
    //req.auth._id, compares the two ids if they match
    //this ensures, the id of the logged in user is same as that in the route param 

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({
            error: 'Access denied'//can't access someone else's information, even though you are logged in
        });
    }
    next();
};


//middleware to check if user is admin or regular user
//check the role (0 or 1) contained in the profile
//0: regular user, 1: admin

exports.isAdmin = (req, res, next) => {
    
    if(req.profile.role === 0){
        //if not admin
        return res.status(403).json({
            error: 'Admin resource, access denied'
        });
    }
    next();
};