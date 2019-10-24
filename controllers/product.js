const formidable = require('formidable');//handles file uploads
const _ = require('lodash');
const fs = require('fs');//file system
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');
//to create a product, form data needs to be sent and image upload needs to be handled -- formidable handles this


//productById - this middleware makes the (a single product) product information available in thee request body
//just like userById, it runs whenever the productId is available in the route parameter
//helps to perform crud operations on the product easily
exports.productById = (req, res, next, id) => {
    //id here will come from the route parameter
    Product.findById(id).exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error: 'Product not found'
            });
        }
        //if product exists, make it available in the req object with the name of 'product'
        req.product = product;
        next();
    })
};

//read single product
//this will return the product from the req.product gotten when productById runs
//remember productById returns a single product
exports.read = (req, res) => {
    //set the product image to undefined, the large image size will slow down the app
    //image will be called with a different route
    req.product.photo = undefined;
    return res.json(req.product);
};

//delete product
exports.remove = (req, res) => {
    //grab product from req.product. since productById runs alongside with this in the route
    let product = req.product;
    product.remove((err) => {
        //if mongoose error occurs
        if(err){
            return res.status(400).json({
                //this error will come from mongoose, use errorhandler function
                error: errorHandler(err)
            })
        }
        //success
        res.json({
            "message": "Product deleted successfully"
        })
    })
};

//update product

exports.update = (req, res) => {
    //init formidabble to handle
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;//keep file extensions
    //parse formd data
    //req = source
    //fields 
    //files
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        //check all fields
        const { name, description, price, category, shipping, quantity } = fields;

        if(!name || !description || !price || !category || !shipping || !quantity){
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        //get product from req.product --- since productById makes runs when this route is called and returns req.product
        //remember req.product doesn't contain photo -- since it slows the app
        //photo is returned by a different route -- hence we handled photo upload first
        let product = req.product;
        //use lodash extend method - takes 2 parameters -- product (above) and update fields 'fields'
        product = _.extend(product, fields);

        //1kb = 1000
        //1mb = 1000000

        //handle files if present
        if(files.photo){
            //console.log(files.photo);

            //limit file size to 1mb
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image cannot be more than 1mb'
                });
            }

            //photo is the name I choose -- depends on how data is sent from client eg image
            //set the photo data and contentType in product model
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type
        }
        //save product
        product.save((err, result) => {
            if(err){
                return res.status(400).json({
                    //this error will come from mongoose, use errorhandler function
                    error: errorHandler(err)
                })
            }
            //no error - send result
            res.json(result);
        })
    });
}

exports.create = (req, res) => {
    //init formidabble to handle
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;//keep file extensions
    //parse formd data
    //req = source
    //fields 
    //files
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        //check all fields
        const { name, description, price, category, shipping, quantity } = fields;

        if(!name || !description || !price || !category || !shipping || !quantity){
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        //no error - create new product using the fields
        let product = new Product(fields);

        //1kb = 1000
        //1mb = 1000000

        //handle files if present
        if(files.photo){
            //console.log(files.photo);

            //limit file size to 1mb
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: 'Image cannot be more than 1mb'
                });
            }

            //photo is the name I choose -- depends on how data is sent from client eg image
            //set the photo data and contentType in product model
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type
        }
        //save product
        product.save((err, result) => {
            if(err){
                return res.status(400).json({
                    //this error will come from mongoose, use errorhandler function
                    error: errorHandler(err)
                })
            }
            //no error - send result
            res.json(result);
        })
    });
};

/**
 * Popular feature for ecommerce apps
 * show products on frontebd based on criteria
 * show sell / arrival 
 * sell - show most sold items 
 * arrivals - newly created products
 * 
 * how to build query for sell:  /products?sortBy=sold&order=desc&limit=4
 * how to build query for arrival:  /products?sortBy=createdAt&order=desc&limit=4
 * 
 * if no params are sent all methods are returne
 */
//for query param eg /:id use req.param
//for query strings eg /products?id use req.query

 exports.list = (req, res) => {
     //grab order from query
     let order = req.query.order ? req.query.order : 'asc';
     //if order   is in query        grab order      or use asc as default
     
     let sortBy = req.query.sortBy ? req.query.sortBy : '_id';//sort by id is default

     let limit = req.query.limit ? req.query.limit : 6 ;//fetch limit of 6 products by default

     //grab product from db based on this criteria above
     Product.find()
        .select("-photo")//hyphen '-' ecludes or deselects photos, will slow down app
        .populate('category')//get category. enabled by the category field set in product model
        .sort([[sortBy, order]])//sort by sortBy and order
        .limit(limit)
        .exec((err, products) => {
            if(err){
                res.status(400).json({
                    error: 'Product not found'
                });
            }
            //if product is found
            res.send(products);
        })
 };