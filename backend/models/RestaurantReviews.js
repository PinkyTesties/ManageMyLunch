//RestaurantReviews.js

/*
This is the Restaurant Review database Model for Mongo.
Where we store & access user account information:
name, star, email, password, date_added, university, updated_date, restaurant_id

Tyler Costa 19075541

*/
const mongoose = require('mongoose');

const RestaurantReviewsSchema = new mongoose.Schema({
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
  restaurantID: {
    type: String,
    required: true
    },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = RestaurantReviews = mongoose.model('restaurantreviews', RestaurantReviewsSchema);