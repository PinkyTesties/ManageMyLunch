//Drivers.js

/*
This is the Driver database Model for Mongo.
Where we store & access driver account information:
name, email, password, date_added, updated_date
- Added wallet balance

Tyler Costa 19075541

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
  },

  wallet_balance: {
    type: Number,
    default: 0
  }
});

module.exports = Driver = mongoose.model('driver', DriverSchema);