//testing setup
const expect = require('expect');
const request = require('supertest');

//es6 destructuring to create vars
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


//Seed data to add to the db. Allows us to add data, but also make it consistent.
const todos = [{
    text: "First test todo"
}, {
    text: "Second test todo"
}];


//this test method runds before each test. Currently we are dropping the db before each test and adding seed data
beforeEach((done)=>{
    Todo.remove({}).then( () => {
        return Todo.insertMany(todos)
    }).then(()=>done());
})

describe('POST /todos', () => {
    it('should create a new todo', (done) =>{
        var text = "testing test todo"

        //using supertest to post a todo. checking port and body
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);


            //then checking the database.
            //currently checking for one result. Would this apply to us?
            }).end((err, res) => {
                
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=>done(e));

            });
    });


    //test to check for nothing being submitted
    it('should not not create an empty to do', (done) => {

        request(app)

            //check for 400 on blank object
            .post('/todos')
            .send({})
            .expect(400)
            .end( (err, res) => {
                if (err) {
                    return done(err);
                } 

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done();
                }).catch((e) => done(e));

            });
    });
});


describe('GET /todos', () => {
    
    it('should get all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);
        })
});


