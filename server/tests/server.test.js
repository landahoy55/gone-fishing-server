//testing setup - expect is the assertion frame work
//request allows us to text routes
const expect = require('expect');
const request = require('supertest');

//es6 destructuring to create vars
const {app} = require('./../server');
const {Session} = require('./../models/session');

const testSessions = [
    {
        "startTime" : "123123123",
        "tide" : "low",
        "weather" : "sunny",
        "location" : "test1",
        "lat" : "5.000303",
        "long" : "121.123123"
    }
    ,{
        "startTime" : "123123123",
        "tide" : "low",
        "weather" : "sunny",
        "location" : "test2",
        "lat" : "5.000303",
        "long" : "121.123123"
    }]

//this test method runs before each test. Currently we are dropping the collection before each test and adding seed data
beforeEach((done)=>{
    Session.remove({}).then( () => {
        return Session.insertMany(testSessions);
    }).then( ()=> done()).catch((e) => done(e));
});

describe('POST /session', () => {

    const testSession = {
        "startTime" : "123123123",
        "tide" : "low",
        "weather" : "sunny",
        "location" : "testing",
        "lat" : "5.000303",
        "long" : "121.123123"
    }

    it('should create a new session', (done) => {

        //post a session, expect 200 response and start time to match
        request(app)
            .post('/session')
            .send(testSession)
            .expect(200)
            .expect((res) => {
                expect(res.body.location).toBe("testing");
            })
            //return if error
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                //check database to see is a record exists - test based on no records intially present/
                Session.find().then((sessions) => {
                    //console.log(sessions);
                    expect(sessions.length).toBe(3);
                    expect(sessions[2].location).toBe("testing");
                    //done must be called!
                    done();
                }).catch((e) => done(e));

            });
    });

    //remove this test.
    //this submits an empty object. 
    //it is currently passing as a new object is created each time /session is hit.
    //think about how the model is set up before adjusting this
    it('should not create a session with bad data', (done) => {
        
                //post a session, expect 200 response and start time to match
                request(app)
                    .post('/session')
                    .send({})
                    .expect(200)
                    //return if error
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        //check database to see is a record exists - test based on no records intially present/
                        Session.find().then((sessions) => {
                            expect(sessions.length).toBe(3);
                            //done must be called!
                            done();
                        }).catch((e) => done(e));
        
                    });
            });
});

//get all sessions
describe('GET /session', () => {
    it('should get all sessions', (done) => {
        request(app)
            .get('/sessions')
            .expect(200)
            .expect( (res) => {
                expect(res.body.sessions.length).toBe(2);
            }).end(done);
    });
});