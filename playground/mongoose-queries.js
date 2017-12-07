const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')

var id = '5a0840ab8a68b05d4153f5733';

//Return todos based on criteria, Moongoose takes care of converting the id string to an id object
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// })

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// })

Todo.findById(id).then((todo) => {
    
    if (!todo) {
        return console.log('Stinking error');
    }
    
    console.log('Todo by Id', todo);
}).catch((e) => {
    console.log(e);
});