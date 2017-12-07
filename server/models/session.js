var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

//The documents ID
//var ObjectId = mongoose.Schema.Types.ObjectId;

//passing an object into the title property containing the type and a default. Required is also commonly used.
//products contains an array of the Product objects created in the other collection -  referencing the object ID. Rather than a copy of the object
var Session = mongoose.model('Session',{
  
  //start time 
  startTime: {
    type: String,
    required: true,
    trim: true
  },
  //end time 
  endTime: {
    type: String,
    required: false,
    trim: true
  },
  //tide
  tide: {
    type: String,
    required: false,
    trim: true,
    default: "Unknown"
  },
  //weather
  weather: {
    type: String,
    required: false,
    trim: true,
    default: "Unknown"
  },
  //location
  location: {
    type: String,
    required: false,
    trim: true,
    default: "Unknown"
  },
  //lat
  lat: {
    type: String,
    required: false,
    trim: true
  },
  //long
  long: {
    type: String,
    required: false,
    trim: true
  },
  //didCatch,
  didCatch:{
    type: Boolean,
    default: false,
    required: false
  },
  quantity:{
    type: Number,
    default: 0
  }
});

//Look up some more Mongoose relationships

//The old export.
module.exports = {Session};