/*
DriverReviewForm.js

This is the api code for the driver reviews. It is used to create and get driver reviews.

It is based on Books.js from Logrocket's MERN stack tutorial: https://blog.logrocket.com/mern-stack-tutorial/

Created by Tyler Costa 19075541
*/

const express = require('express');
const router = express.Router();

// Import the RestaurantReviews model
const DriverReviews = require('../../models/DriverReviews');

// @route   POST api/reviews
// @desc    Add new review to database
// @access  Public
router.post('/', async (req, res) => {
  const { name, stars, title, textarea, driver_email } = req.body;

  try {
    const newReview = new DriverReviews({
      name,
      stars,
      title,
      textarea,
      driver_email
    });

    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/email
// @desc    Get a driver's reviews by email
// @access  Public
router.get('/:email', async (req, res) => {
  try {
    const reviews = await DriverReviews.find({ driver_email: req.params.email });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;