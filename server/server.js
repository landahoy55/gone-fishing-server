//library imports
var express = require('express');
var bodyParser = require('body-parser');


//Local imports
//using ES6 destructuring to create the var.

//connection
var {mongoose} = require('./db/mongoose.js');
//models
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

//set up the app and the middleware - body parser returns a json object
var app = express();
app.use(bodyParser.json());

//URL config for creating a new todo. Posting.
app.post('/todos', (req, res) => {
    console.log(req.body);

    //creating a request object from the request
    var todo = new Todo({
        text: req.body.text
    });

    //saving the object to the db
    todo.save().then( (doc) => {
        
        //send back the response to the user.
        res.send(doc)

    }, (err) => {

        //nice little chain.
        res.status(400).send(err);

    });

})

//get all todos
//Using promieses for async. First is if successful. Second handles errors.
app.get('/todos', (req, res) => {
    Todo.find().then( (todos) => {
        //rather than array, return an object - more flexible in approach
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
})

app.listen(3000, () => {
    console.log('Started on Port 3000')
});

module.exports = {app};


