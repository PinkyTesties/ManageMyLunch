// routes/api/MenuItems.js

const express = require('express');
const router = express.Router();

// Load MenuItem model
const MenuItems = require('../../models/MenuItem');

// @route   GET api/menuItems/test
// @desc    Tests menuItems route
// @access  Public
router.get('/test', (req, res) => res.send('menuItems route testing!'));

// @route   GET api/menuItems
// @desc    Get all menuItems
// @access  Public
router.get('/', (req, res) => {
  const restaurantId = req.query.restaurant_id;
  let query = {};

  if (restaurantId) {
    query.restaurant_id = restaurantId;
  }

  MenuItems.find(query)
    .then(menuItems => res.json(menuItems))
    .catch(err => res.status(404).json({ nomenuitemsfound: 'No menu items found' }));
});

// @route   GET api/menuItems/:id
// @desc    Get single menuItem by id
// @access  Public
router.get('/:id', (req, res) => {
  MenuItems.findById(req.params.id)
    .then(menuItem => res.json(menuItem))
    .catch(err => res.status(404).json({ nomenuitemsfound: 'No menu items found' }));
});

// @route   POST api/menuItems
// @desc    Add/save menuItem
// @access  Public
router.post('/', (req, res) => {
  MenuItems.create(req.body)
    .then(menuItem => res.json({ msg: 'MenuItem added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this menuItem' }));
});



// @route   PUT api/menuItems/:id
// @desc    Update menuItems by id
// @access  Public
router.put('/:id', (req, res) => {
  MenuItems.findByIdAndUpdate(req.params.id, req.body)
    .then(menuItem => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route   DELETE api/menuItems/:id
// @desc    Delete menuItems by id
// @access  Public
router.delete('/:id', (req, res) => {
  MenuItems.findByIdAndDelete(req.params.id)
    .then(menuItem => res.json({ msg: 'menuItems entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such menuItems' }));
});


module.exports = router;