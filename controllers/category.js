const Category = require('../models/category');
const {errorHandler} = require('../helpers/dbErrorHandler');

//create a new category
exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        //return saved data
        res.json({ data });
        })
};

//runs each time categoryId exists in route param - returns the category
exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category){
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }

        //if category is found, add it to the req object
        req.category = category;
        next();
    })
};

//read single category
exports.read = (req, res) => {
    //return category from request object
    return res.json(req.category);
};

//update category
exports.update = (req, res) => {
    //get category from req.category
    const category = req.category;
    category.name = req.body.name;

    //save record
    category.save((err, data) => {
        if(err){
            res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    })
};

exports.remove = (req, res) => {
    //get category from req.category
    const category = req.category;
    //delete record
    category.remove((err, data) => {
        if(err){
            res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            "message": "Category deleted successfully"
        });
    })
};

//get all categories
exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if(err){
            res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    })
};