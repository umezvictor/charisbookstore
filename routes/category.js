const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { create,  categoryById, read, update, remove, list} = require('../controllers/category');
const { userById } = require('../controllers/user');


//get single category
router.get('/category/:categoryId', read);

//create category
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);//only admins can access this route

//update category
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);//only admins can access this route

//delete categories
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);//only admins can access this route

//get all categories
router.get('/categories', list)

router.param('userId', userById);

//categoryById  -- runs each time categoryId exists in route param
router.param('categoryId', categoryById);

module.exports = router;