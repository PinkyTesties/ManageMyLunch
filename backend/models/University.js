// models/University.js

/*
This is the university database Model for Mongo.
Where we store university information:
name, address, coordinates

Tyler Costa 19075541


*/
const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    }
  }
});

module.exports = mongoose.model('University', UniversitySchema);