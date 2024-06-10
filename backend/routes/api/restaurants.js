// routes/api/restaurants.js
/*
This is the api code for the restaurants. It is used to create, get, update and delete restaurants.

Created by Tyler Costa 19075541
*/
const express = require('express');
const multer = require('multer');

const router = express.Router();

// Load restaurants model
const Restaurant = require('../../models/Restaurants');

// Set up storage for images that are uploaded
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './restaurant_assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });


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
router.post('/', upload.single('image'), (req, res) => {
  console.log(req.body); // log the body
  console.log(req.file); // log the file

  const newRestaurant = new Restaurant({
    ...req.body,
    RestaurantImage: req.file ? req.file.filename : ''
  });

  newRestaurant
    .save()
    .then(restaurant => res.json({ msg: 'Restaurant added successfully' }))
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