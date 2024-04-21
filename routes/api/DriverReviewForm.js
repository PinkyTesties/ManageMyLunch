// Import the necessary modules
const express = require('express');
const router = express.Router();

// Import the RestaurantReviews model
const DriverReviews = require('../../models/DriverReviews');

// POST api/reviews
// Create a new review

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
// // GET api/reviews/:restaurantID
// // Get all reviews for a specific restaurant
// router.get('/:restaurantID', async (req, res) => {
//   try {
//     const reviews = await RestaurantReviews.find({ driver_email: req.params.driver_email });
//     res.json(reviews);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// GET api/reviews/:email
// Get all reviews for a specific driver
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