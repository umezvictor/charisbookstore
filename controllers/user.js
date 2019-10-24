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
} 