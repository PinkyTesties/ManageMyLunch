//Drivers.js

/*
This is the Driver database Model for Mongo.
Where we store & access driver account information:
name, email, password, date_added, updated_date

*/
const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  date_added: {
    type: Date,
    default: Date.now
  },

  updated_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Driver = mongoose.model('driver', DriverSchema);