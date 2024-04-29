// Import the necessary modules
const express = require('express');
const router = express.Router();

// Import the RestaurantReviews model
const RestaurantReviews = require('../../models/RestaurantReviews');

// POST api/reviews
// Create a new review
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

// GET api/reviews/:restaurantID
// Get all reviews for a specific restaurant
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