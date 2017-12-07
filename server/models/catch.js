const mongoose = require('mongoose');

//create model - inlcudes some validation
//Trim will deal with any trailing or leading spaces


/* TODO - Add species */
const Catch = mongoose.model('Catch', {
    time: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    quantity: {
        type: Number,
        default: 0
    }
});

module.exports = {Catch};