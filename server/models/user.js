const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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

var User = mongoose.model('User', UserSchema );

module.exports = {User}; 

