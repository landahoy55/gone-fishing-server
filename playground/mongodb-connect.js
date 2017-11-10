
//This is an example of a feature called object destructuring. 
//It enables the creation of variable from an objects properties. Variable names must match property names.
//Mongoclient to connect to db
//ObjectID to allow us to use timestamp feature - not used now
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//Connecting to the database with a callback function to run after connection attempt.
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    
    if (err) {
        return console.log('Unable to connect to the server');
    } 

    console.log('Connected to the MongoDB server');

    //creating a collection and inserting one document
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     complete: false
    // }, (err, results) => {
    //     if (err) {
    //         return console.log('Error - Unable to insert todo', err);
    //     }
        
    //     console.log(JSON.stringify(results.ops, undefined, 2));
    
    // })


    //insert new doc into User. (name, age, location)
    db.collection('Users').insertOne({
        name: 'Pete',
        age: 32,
        location: 'Torquay'

    }, (err, results) => {

        if (err) {
            return console.log('Error - Unable to insert user', err)
        }

        console.log(JSON.stringify(results.ops, undefined, 2));

    });


    //doesn't appear to be closing
    db.close();

});

