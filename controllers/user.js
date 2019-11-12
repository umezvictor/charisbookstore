const User = require('../models/user');

//runs whenever userId is passes in route param
exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            //if user not found
            return res.status(400).json({
                error: 'User not found'
            });
        }
        //if user is found, add user to request object with the name profile
        req.profile = user;
        next();//a must for all middlewares
    })
};

//return user profile
exports.read = (req, res) => {
    //return user profile from req.profile, excluding password and salt
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    //return the remaining records
    return res.json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, (err, user) => {
        if(err){
            return res.status(400).json({
                error: 'You are not authorised to perform this action'
            });
        }
        //set password and salt to undefined
        user.hashed_password = undefined;
        user.salt = undefined;
        
        res.json(user);
    });
};