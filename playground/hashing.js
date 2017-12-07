//const {SHA256} = require('crypto-js');

//jwt.io for more info
//Jsonwebtoken has two methods to sign and verify tokens. Highlighting potential man in the middle attacks.
const jwt = require('jsonwebtoken');

var testData = {
    id: 10
};

//The second parameter is the secret - to salt the hash.
//This is what we will be storing in tokens array.
var token = jwt.sign(testData,'salty');
console.log(token);


var decoded = jwt.verify(token, 'salty');
console.log(decoded);