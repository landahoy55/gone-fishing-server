//Deleting records

const {MongoClient, ObjectID} = require('mongodb');

//Connecting to the database with a callback function to run after connection attempt.
MongoClient.connect('mongodb://localhost:27017/todoapp', (err, db) => {
    
    if (err) {
        return console.log('Unable to connect to the server');
    } 

    console.log('Connected to the MongoDB server');

    //delete many
    // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then( (result) => {
    //     console.log(result);
    // });


    //delete one
    // db.collection('Todos').deleteOne({text: 'Eat Bum'}).then( (result) => {
    //     console.log(result);
    // });

    //find one and delete - dis the king of methods.
    db.collection('Todos').findOneAndDelete({complete: false}).then(
        (result) =>
        console.log(result)
    );


    //doesn't appear to be closing
    //db.close();

});

