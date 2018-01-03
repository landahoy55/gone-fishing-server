var {User} = require('./../models/user');
//middleware

//testing authentication - returns user details
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    //model method to find user. Like findById - static model.
    User.findByToken(token).then((user) => {
        //todo: handle is no user... is this legit? will this come back in the promise catch?
        if (!user) {
            //token matches no user returned - shouldn't hit this. could replace with promise.reject()
            res.status(401).send();
        }
        //set up user
        req.user = user;
        req.token = token;
        next();

    }).catch((e) => {
        //401 auth erro
        res.status(401).send();
    })
};

module.exports = {authenticate};