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

//creates a new product
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
 * how to build query for sell:  
 * /products?sortBy=sold&order=desc&limit=4  - this query will come from the frontend app eg react
 * how to build query for arrival:  /products?sortBy=createdAt&order=desc&limit=4
 * 
 * if no params are sent, all methods are returned
 */
//for query param eg /:id use req.param
//for query strings eg /products?id use req.query

 exports.list = (req, res) => {
     //grab order from query
     let order = req.query.order ? req.query.order : 'asc';
     //if order   is in query        grab order      or use asc as default
     
     let sortBy = req.query.sortBy ? req.query.sortBy : '_id';//sort by id is default

     let limit = req.query.limit ? parseInt(req.query.limit) : 6 ;//fetch limit of 6 products by default
     //without parseInt, it will treat the limit from the query as string

     //grab product from db based on this criteria above
     Product.find()
        .select("-photo")//hyphen '-' ecludes or deselects photos, will slow down app
        .populate('category')//get category details. enabled by the category field set in product model
        .sort([[sortBy, order]])//sort by sortBy and order
        .limit(limit)
        .exec((err, products) => {
            if(err){
                res.status(400).json({
                    error: 'Product not found'
                });
            }
            //if product is found
            res.json(products);//returns all the products based on the query
        })
 };

 /**
  * will find other products that are related to the product (req.product) whose id was supplied 
  * in the route param -- excluding the product itself, representted by {$ne: req.product} $ne means 'not including'
  * in other words, it returns its siblings. 
  * i.e other products that are in the same category as it - category: req.product.category
  */
 exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6 ;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name')//populate the category field in product model with id and name from the Category it references
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: 'Products not found'
            });
        }
        res.json(products);
    })
 };


//fetches all this categories that are used in the Product Model
//here we use the distinct method -- distinct to the Product Model
 exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error: 'categories not found'
            });
        }
        res.json(categories);
    });
 };



 /**
  * list products by search
  * product search will be implemented in the react frontend
  *  categories will be shown in checkboxes and price range in radio buttons
  * as the user clicks on those checkbox and radio buttons
  * an api request will be made and then show the products to the user based on what he wants
  */
 exports.listBySearch = (req, res) => {
     //these queries can be added to the route param
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip); //will be called when user clicks on 'load more' to view more products
    let findArgs = {};//will contain the category id and price range; will be populated from the request body

    for(let key in req.body.filters){//grab the key from the request body object
        if(req.body.filters[key].length > 0){//check if the length of the key > 0
            if(key === "price"){//check if the key is the string/word 'price'
                //$gte and $lte are keys we can use in mongodb just like $ne
                //gte - greater than price [0-10]
                //lte - less than
                findArgs[key] = {
                    //get key greater than 0
                    $gte: req.body.filters[key][0],//first element at index 0 = 0  ie [0-10], or [10-20] etc
                    //get key less than 1
                    $lte: req.body.filters[key][1],////second element at index 1 = 10 ie [0-10]
                };
            }else{
                //otherwise grab the keys which will be the categories
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    //perform product search using the key obtained above
    Product.find(findArgs)
        .select("-photo")//exclude product photo
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if(err){
                return res.status(400).json({
                    error: 'Products not found'
                });
            }

            res.json({
                size: data.length,//number of products
                data
            });
        });
    
 };


 //returns product photo
 //works as a middleware
 //runs everytime the route -/product/photo/:productId'- is called
 //will return the product as a middleware and the app will continue running
 //the route has productId which calls productById method above which gives us the product in the req object
 exports.photo = (req, res) => {
    //check if the photo exists
    if(req.product.photo.data){
        //set the content type eg image/jpeg
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }

    next();
 };