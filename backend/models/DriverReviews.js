//DriversReviews.js

/*
This is the Restaurant Review database Model for Mongo.
Where we store & access user account information:
name, star, email, password, date_added, university, updated_date

*/
const mongoose = require('mongoose');

const DriverReviews = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  stars: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
    },
  textarea: {
    type: String,
    required: true
  },
  driver_email: {
    type: String,
    required: true
    },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('driverreviews', DriverReviews);