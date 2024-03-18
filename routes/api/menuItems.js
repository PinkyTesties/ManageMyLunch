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
  MenuItems.find()
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

module.exports = router;