
//Take in values, run 2000 iterations on test data.
var synaptic = require('synaptic'); 
var trainingData = require('./trainingData.js');
//Multi layer perceptron - regression test.
var myNetwork = new synaptic.Architect.Perceptron(4, 10, 1);
var trainer = new synaptic.Trainer(myNetwork);

trainer.train(trainingData,{
	rate: .1,
	iterations: 4000,
	error: .005,
    //log: 1,
	shuffle: true
});

//normalised functions
const tide = (inputTide) => {
  switch (inputTide) {
    case 'high':
        return normalisedTide = 1;
        break;
    case 'low':
        return normalisedTide = 0;
        break;
  }
}

const month = (inputMonth) => {
  return inputMonth / 100;
}

const location = (inputLocation) => {
  switch (inputLocation) {
    case 'Torquay':
        return normalisedLocation = 0.01;
        break;
    case 'Exmouth':
        return normalisedLocation = 0.02;
        break;
    case 'Plymouth':
        return normalisedLocation = 0.03;
        break;
  }
}

const temperature = (inputTemp) => {
  return inputTemp / 100;
}

//take in values
    
module.exports = (inputMonth, inputTide, inputLocation, inputTemp) => {

    return new Promise((resolve, reject) => {
        //normalise with funcs
        const normalisedMonth = month(inputMonth);
        const normalisedTide = tide(inputTide);
        const normalisedLocation = location(inputLocation);
        const normalisedTemp = temperature(inputTemp);

        //console.log("***********", inputLocation);

        //create array
        const data = [ normalisedMonth, normalisedTide, normalisedLocation, normalisedTemp ];
        
        const result = myNetwork.activate(data);

        console.log("***************", data[1])

        //if the first element of the array is NaN then reject, else resolve
        if (!isNaN(result[0])){
            console.log("is number", result)
            resolve(result);
        } else {
            console.log("is not number", result)
            reject('Ooops');
        }

    });
};


//console.log(inputData(3, 'Low', 'Exmouth', 8));
//this code in express app.
// inputData(3, 'Low', 'Exmouth', 8).then((fromResolve) => {
//     console.log(fromResolve);
// }).catch((formReject) => {
//     console.log(formReject)
// });