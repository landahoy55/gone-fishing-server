//Finding a record

const {MongoClient, ObjectID} = require('mongodb');

//Connecting to the database with a callback function to run after connection attempt.
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    
    if (err) {
        return console.log('Unable to connect to the server');
    } 

    console.log('Connected to the MongoDB server');

    //An approach to returning all documents.
    //To array returns a promise. So use 'then'
    //within find is the query - pass in key value pairs
    // db.collection('Todos').find({complete: false}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // });



    
    //Counting documents
    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`)
    }, (err) => {
        console.log('Unable to fetch todos', err)
    });

    //doesn't appear to be closing
    //db.close();

});

