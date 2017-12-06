//testing setup - expect is the assertion frame work
//supertest allows us to text routes
const expect = require('expect');
const request = require('supertest');

//to get at object id
const {ObjectID} = require('mongodb');

//es6 destructuring to create vars
const {app} = require('./../server');
const {Session} = require('./../models/session');

const testSessions = [
    {
        _id: new ObjectID(),
        "startTime" : "123123123",
        "tide" : "low",
        "weather" : "sunny",
        "location" : "test1",
        "lat" : "5.000303",
        "long" : "121.123123"
    }
    ,{
        _id: new ObjectID(),
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

describe('GET /session/:id', () => {
    it('should return test session', (done) => {
        request(app)
            //template strings to get at test sessions above
            .get(`/sessions/${testSessions[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                console.log(res.body);
                expect(res.body.session.location).toBe(testSessions[0].location);
            }).end(done);
    });
});


describe('DELETE /sessions/:id', () => {
    it('should remove a session', (done) => {
        var id = testSessions[1]._id.toHexString();

        request(app)
            .delete(`/sessions/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.session._id).toBe(id)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
            
            //queries db for session, should not exist.
            Session.findById(id).then((session) => {
                expect(session).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    });

    //todo 404s
});

describe('PUT /session/endtime', () => {
    it('should update the endtime', (done) => {

        var id = testSessions[1]._id.toHexString();

        request(app)
            .put('/session/endtime')
            .send({"id":id})
            .expect(200)
            .expect( (res) => {
                console.log(res.body);
                expect(res.body.endTime).toBeTruthy();
                done();
            }).catch((e) => done(e));
    });

});