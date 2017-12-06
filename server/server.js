//env set up - port and db
require('./config/config');

//library imports
const express = require('express');
const bodyParser = require('body-parser');

//Local imports
//using ES6 destructuring to create the var.
//connection
const {mongoose} = require('./db/mongoose.js');
//models
//bring in models
//const {Catch} = require('./models/catch.js');
const {Session} = require('./models/session.js');

//to access ObjectID methods
const {ObjectID} = require('mongodb');


//set up the app and the middleware - body parser returns a json object
const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

//Get all sessions
//Using promises for async. First is if successful. Second handles errors.
app.get('/sessions', (req, res) => {
    Session.find().then( (sessions) => {
        //rather than array, return an object - more flexible in approach
        res.send({sessions});
    }, (e) => {
        res.status(400).send(e);
    });
})

//Get one session by id - 5a245b3104498d4271bd96e7
//adjust to body rather than params.
app.get('/sessions/:id', (req, res) => {
    Session.findById(req.params.id).then( (session) => {
        //rather than array, return an object - more flexible in approach
        res.send({session});
    }, (e) => {
        res.status(400).send(e);
    });

    //todo:
    //add 404 errors and testing

})

//Get all by location - Torquay
//adjust to body rather than params.
app.get('/locations/:id', (req, res) => {

    let local = req.params.id;
    Session.find({location:local}).then( (session) => {
        res.send(session);
    }, (e) => {
        res.status(400).send(e);
    });
})

//Post session
app.post('/session', (req, res) => {
    console.log(req.body);

    //getTime returns epoch
    let currDate = new Date().getTime();

    //creating a request object from the request
    var session = new Session({
        startTime: currDate,
        endTime: req.body.endTime,
        tide: req.body.tide,
        weather: req.body.weather,
        location: req.body.location,
        lat: req.body.lat,
        long: req.body.long,
        didCatch: req.body.didCatch,
        quantity: req.body.quantity
    });

    //saving the object to the db
    session.save().then( (doc) => {
        //send back the response to the user.
        res.send(doc)

    }, (err) => {

        //nice little chain.
        res.status(400).send(err);
    
    });

})

//update quantity
app.put('/session/quantity', (req, res) => {
    console.log(req.body.id);
    let id = {'_id':req.body.id}
    let quantity = {'quantity': req.body.quantity}

    Session.findOneAndUpdate(id, quantity, {upsert:true}, function(err, doc){
        if (err) { 
            return res.send(500, { error: err }); 
        }
        //response is original document.
        return res.send(doc);
    });
})

//update didcatch
app.put('/session/didcatch', (req, res) => {
    console.log(req.body.id);
    let id = {'_id':req.body.id}
    let didcatch = {'didCatch': req.body.didcatch}

    Session.findOneAndUpdate(id, didcatch, {upsert:true}, function(err, doc){
        if (err) { 
            return res.send(500, { error: err }); 
        }
        //response is original document.
        return res.send(doc);
    });
})

//update endtime
app.put('/session/endtime', (req, res) => {
    //console.log(req.body.id);
    let id = {'_id':req.body.id}
    //set date here.
    let currDate = new Date().getTime();
    let endtime = {'endTime': currDate};

    Session.findOneAndUpdate(id, endtime, {new: true}, function(err, doc){
        if (err) { 
            return res.send(500, { error: err }); 
        }
        //response is original document.
        return res.send(doc);
    });
})

//Remove session
app.delete('/sessions/:id', (req, res) => {
    //get id
    var id = req.params.id;

    //throw back 404 if ID is not valid
    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Session.findByIdAndRemove(id).then((session) => {
        //400 is doesn't exist
        if (!session) {
            return res.status(404).send()
        }

        res.send({session})

    //need to catch errors as part of promises
    }).catch((e) => {
        res.status(400).send();
    });

});


app.listen(port, () => {
    console.log(`Started on Port ${port}`);
});

//export to use in testing 
module.exports = {app};




