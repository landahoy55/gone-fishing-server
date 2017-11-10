var mongoose = require('mongoose');

//need to tell mongoose that we want to use promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useMongoClient: true });

//ES6 sweet way of exporting, no need to supply a name if it is the same as the object.
module.exports = {mongoose};