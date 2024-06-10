// models/Resturants.js

/*
This is the Restaurant database Model for Mongo.
Where we store & access user account information:
restaurantName, cuisine, address, latitude, longitude, rating, description, RestaurantImage

Tyler Costa 19075541

*/
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },

  rating: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  RestaurantImage: {
    type: String,
    required: true
  }

});

module.exports = Restaurant = mongoose.model('restaurant', RestaurantSchema);