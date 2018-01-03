const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


//todo: add user name etc

//User schema - with email validation - validator package highlighted in Mongoose docs.
//isAsync added to remove deprecation warning
//to create tokens we need instance methods, they can only be created in schemas rather than models. 

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 1,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.createAuthTokens = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'salty').toString();

    user.tokens.push({access, token});

    return user.save().then(()=>{
        return token;
    });
}

//hashing middleware. Runs before 'save'
//not using arrow function - need this binding
//next must be called in the function
UserSchema.pre('save', function (next) {
    
    var user = this;

    //check to see if hash is modified field. Avoid double hash
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
    
});

//static method to check user status
UserSchema.statics.findByToken = function(token) {
    
    //bind to model not inst
    var User = this;
    var decoded;

    //try catch block. Like Swift. Check for error, do something if error appears.
    try {
        decoded = jwt.verify(token, 'salty')
    } catch (e) {
        //handle rejection
        return new Promise((resolve, reject) => {
            reject();
        });
    }

    //promise return - get at with .then. returns matching user
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access':'auth'
    });

};



var User = mongoose.model('User', UserSchema );

module.exports = {User}; 

