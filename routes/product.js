const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { create, productById, read, remove, update, list } = require('../controllers/product');
const { userById } = require('../controllers/user');

//read single product
router.get('/product/:productId', read);

//create new product
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);//only admins can access this route

//delete product - requires userId to be sure only admin can delete product
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);

//update product
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);

//get  all products
router.get('/products', list);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;