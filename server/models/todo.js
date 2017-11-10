var mongoose = require('mongoose');

//create model - inlcudes some validation
//Trim will deal with any trailing or leading spaces
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Todo};

// //Using model
 
// var newTodo = new Todo({
//     text: '  sweet trim test  '
// });

// //saving model, using promises
// newTodo.save().then( (doc) => {
//     console.log(`Saved todo ${doc}`)
// }, (e) => {
//     console.log(`There is an error: ${e}`)
// });