//Updating records

const {MongoClient, ObjectID} = require('mongodb');

//Connecting to the database with a callback function to run after connection attempt.
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    
    if (err) {
        return console.log('Unable to connect to the server');
    } 

    console.log('Connected to the MongoDB server');

    //Update call takes a lot more arguments that inserting, finding and deleting. 
    //See the main docs

    db.collection('Todos').findOneAndUpdate({
        _id : new ObjectID('5a05a6475af4870404a8948e')
    }, {
        $set: {
            complete: false
        }
    }, {
        returnOriginal: false
    
    }).then((result) => {
        console.log(result)
    });


    //doesn't appear to be closing
    //db.close();

});

