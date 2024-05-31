/**

This file contains the routes for the review form. The routes are used to create a new review and get all reviews for a specific restaurant.
 
Created by Tyler Costa 19075541
*/
const express = require('express');
const router = express.Router();

// Import the RestaurantReviews model
const RestaurantReviews = require('../../models/RestaurantReviews');

// @route   POST api/reviewForm
// @desc    add a new review to the database
// @access  Public
router.post('/', async (req, res) => {
  const { name, stars, title, textarea, restaurantID } = req.body;

  try {
    const newReview = new RestaurantReviews({
      name,
      stars,
      title,
      textarea,
      restaurantID
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reviews/:restaurantID
// @desc    Get all reviews for a specific restaurant
// @access  Public
router.get('/:restaurantID', async (req, res) => {
  try {
    const reviews = await RestaurantReviews.find({ restaurantID: req.params.restaurantID });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;