var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

//The documents ID
//var ObjectId = mongoose.Schema.Types.ObjectId;

//passing an object into the title property containing the type and a default. Required is also commonly used.
var Session = mongoose.model('Session',{
  
  //sessionStart time
  sessionStart: {
    type: Number,
    required: true,
    trim: true
  },
  //end time 
  sessionEnd: {
    type: Number,
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
  //weatherDesc
  weatherDesc: {
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
    type: Number,
    required: false,
    trim: true
  },
  //long
  long: {
    type: Number,
    required: false,
    trim: true
  },
  //didCatch,
  didCatch:{
    type: Boolean,
    default: false,
    required: false
  },
  numberCaught:{
    type: Number,
    default: 0
  },
  temp:{
    type: String,
    default: '10'
  },
  note:{
    type: String,
    default: ''
  }
});

//Look up some more Mongoose relationships

//The old export.
module.exports = {Session};