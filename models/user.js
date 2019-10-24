//User mdodel
const mongoose = require('mongoose');
//crypto for encrypting password
const crypto = require('crypto');
//uuid for creating unique string
const uuidv1 = require('uuid/v1');

//user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    //schema allows you add vitual field
    hashed_password: {
        type: String,
        required: true,
    },
    //additional user info
    about: {
        type: String,
        trim: true,
    },
    //salt will be used to generate hashed password
    salt: String,
    //role, 0 = regular user, 1 = admin
    role: {
        type: Number,
        default: 0
    },
    //history - stores items previously purchased by user
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true}
);


//virtual fields
userSchema.virtual('password')//password from client
.set(function(password){
    this._password = password
    this.salt = uuidv1()//returns a random string for hashin the pasord
    this.hashed_password = this.encryptPassword(password);//encrypts the plain password from the client and saves it as hashed_password
})
.get(function(){
    return this._password;
})
//add the encryptPassword to the userSchema
userSchema.methods = {
    //method to authenticate user
    //compare plaintext entered by user with hashed password in db
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    //method to encrypt password
    encryptPassword: function(password){
        if(!password) return '';//stop if no password
        try{
            //encrypt password using crypto
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return '';
        }
    }
};

module.exports = mongoose.model("User", userSchema);