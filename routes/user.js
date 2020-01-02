const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById, read, update } = require('../controllers/user');
//whenever there is a user id in the route parameter
//this method will run automatically and make the user available in the req object
//this can be used to display user info in their dashboard, etc


//requireSignin and isAuth methods are similar in operation
//difference is requiresignim allows you access resources if you are signed in
//isAuth takes it a step further and ensures you can't access someone else's records
//isAdmin ensures only admin can access admin resources


router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile
    });
});


//route to read user profile
router.get('/user/:userId', requireSignin, isAuth, isAdmin, read);

//route to update user profile
router.put('/user/:userId', requireSignin, isAuth, isAdmin, update);

//execute userById method whenever userId exists in route param
router.param('userId', userById);

module.exports = router;