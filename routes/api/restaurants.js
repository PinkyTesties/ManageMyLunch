// routes/api/restaurants.js

const express = require('express');
const router = express.Router();

// Load restaurants model
const Restaurant = require('../../models/Restaurants');

// @route   GET api/restaurants/test
// @desc    Tests restaurants route
// @access  Public
router.get('/test', (req, res) => res.send('restaurants route testing!'));

// @route   GET api/restaurants
// @desc    Get all restaurants
// @access  Public
router.get('/', (req, res) => {
  Restaurant.find()
    .then(restaurants => res.json(restaurants))
    .catch(err => res.status(404).json({ norestaurantsfound: 'No restaurants found' }));
});

// @route   GET api/restaurants/:id
// @desc    Get single restaurants by id
// @access  Public
router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .then(restaurants => res.json(restaurants))
    .catch(err => res.status(404).json({ norestaurantsfound: 'No restaurants found' }));
});

// @route   POST api/restaurants
// @desc    Add/save restaurants
// @access  Public
router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(restaurants => res.json({ msg: 'restaurants added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this restaurant' }));
});

// @route   PUT api/restaurants/:id
// @desc    Update restaurants by id
// @access  Public
router.put('/:id', (req, res) => {
  Restaurant.findByIdAndUpdate(req.params.id, req.body)
    .then(restaurants => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/restaurants/:id
// @desc    Delete restaurants by id
// @access  Public
router.delete('/:id', (req, res) => {
  Restaurant.findByIdAndDelete(req.params.id)
    .then(restaurants => res.json({ mgs: 'Restaurants entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a restaurants' }));
});



module.exports = router;