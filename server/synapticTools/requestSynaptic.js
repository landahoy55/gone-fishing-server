//import synapticFunc
const inputData = require('./synapticFunc.js');

//this code in express app.
inputData(3, 'Low', 'Exmouth', 8).then((fromResolve) => {
    console.log(fromResolve);
}).catch((formReject) => {
    console.log(formReject)
});