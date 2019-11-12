const express = require('express');
const router = express.Router();
const { userSignupValidator } = require('../validator');//invokes index.js file automatically
//bring in methods from controller
const { signup, signin, signout } = require('../controllers/auth');

//userSignupValidator -- validates user input
//all the route logic will be handled in the controller
router.post('/signup', userSignupValidator, signup);

router.post('/signin', signin);

router.get('/signout', signout);

module.exports = router;
