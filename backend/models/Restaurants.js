// models/Resturants.js

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