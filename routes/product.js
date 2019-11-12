const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

const { create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo
} = require('../controllers/product');
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

//get  related products -- productId invokes productById method in product controller
router.get('/products/related/:productId', listRelated);

//get category based on products
router.get('/products/categories', listCategories);

//route to search for products
//post method is used here because the req body will be sent
router.post('/products/by/search', listBySearch);

//get product photo
router.get('/product/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;