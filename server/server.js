//env set up - port and db
require('./config/config');
require('synaptic');
const inputData = require('./synapticTools/synapticFunc');

//library imports
const express = require('express');

//widely used middleware that allows access to req.body, and simplified JSON manpulation
const bodyParser = require('body-parser');
//Widely used utility functions
const _ = require('lodash');

//Local imports
//using ES6 destructuring to create the var.
//connection
const { mongoose } = require('./db/mongoose.js');
//models
//bring in models
//const {Catch} = require('./models/catch.js');
const { Session } = require('./models/session.js');
const { User } = require('./models/user.js');
const { authenticate } = require('./middle/auth.js');

//to access ObjectID methods
const { ObjectID } = require('mongodb');


//******socket.io - rather than using express apps interpretation of http, sockets.io needs to run directy via http
const http = require('http');
const socketIo = require('socket.io');

//set up the app and the middleware - body parser returns a json object
const app = express();
//dev and deploy
const port = process.env.PORT;

//************ socket.io config - remember to listen on server rather than app...*/
const server = http.createServer(app);
const io = socketIo(server);


//Allow CORS on all domains and localhosts
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
    next();
});


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


//Get synapticjs assessment - liklihood of catching
app.post('/probability', (req, res) => {
    
    let month = req.body.month;
    let tide = req.body.tide;
    let location = req.body.location;
    let temp = req.body.temp;

    //this code in express app.
    // 3, 'Low', 'Exmouth', 8
    inputData(month, tide, location, temp).then((fromResolve) => {
        res.send(fromResolve);
    }).catch((formReject) => {
        res.send(formReject)
    });
    
});


//Post session
app.post('/session', (req, res) => {
   
    //getTime returns epoch
    let currDate = new Date().getTime(); //redundant - passed from front end
    //creating a request object from the request
    var session = new Session({
        sessionStart: req.body.sessionStart,
        sessionEnd: req.body.sessionEnd,
        tide: req.body.tide,
        weatherDesc: req.body.weatherDesc,
        location: req.body.location,
        lat: req.body.lat,
        long: req.body.long,
        numberCaught: req.body.numberCaught,
        note: req.body.note,
        temp: req.body.temp,
        didCatch: req.body.didCatch
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



//Signup users
//POST /Users
app.post('/users', (req, res) => {

    //using lodash to take specific bit of the request. Different approach to creating a session.
    //picks off just the two properties of the body.
    var reqBody = _.pick(req.body, ['email', 'password']);
    var user = new User(reqBody);

    user.save().then(() => {
        return user.createAuthTokens()
        //res.send(user);
    }).then((token) => {
        //http header, prefix with x means custom
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        console.log('400 error on signup')
        res.status(400).send(e);
    })
});

//testing authentication - returns user details
//authenticate is the middleware, created in auth.js
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
}); 


io.on('connection', (socket) => {
    socket.on('message', (body) => {
        socket.broadcast.emit('message', {
            body: body,
            from: socket.id.slice(3)
        });
    })
})

//socket.io requires server.listen rather than app.listen
server.listen(port, () => {
    console.log(`Started on Port ${port}`);
});

//export to use in testing ************ does this need to be server to?
module.exports = {app};




