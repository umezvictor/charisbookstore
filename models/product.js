const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

//user schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    //when we refer to the product category, it will go to the category model -- relationship 
    //this field will hold the __ids fro category model
    category: {
        type: ObjectId,//mongoose schema.ObjectId, can also use Number, string and buffer
        ref: 'Category',//relates to the Category model, tells mongoose to use Category model during population 
        required: true
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    shipping: {
        required: false,
        type: Boolean
    },
    
}, {timestamps: true}
);



module.exports = mongoose.model("Product", productSchema);