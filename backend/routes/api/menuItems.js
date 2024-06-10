// routes/api/MenuItems.js

/*
This is the api code for the menu items. It is used to create, get, update and delete menu items.

*/
const express = require('express');
const multer = require('multer');

const router = express.Router();

// store MenuItem model
const MenuItems = require('../../models/MenuItem');

// Set up storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './menuItem_assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

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
// @desc    Add/save menuItems
// @access  Public
router.post('/', upload.single('image'), (req, res) => {
  console.log(req.body); // log the body
  console.log(req.file); // log the file

  const newMenuItem = new MenuItems({
    ...req.body,
    ingredients: JSON.parse(req.body.ingredients),
    menuItemImage: req.file ? req.file.filename : ''
  });

  newMenuItem
    .save()
    .then(menuItem => res.json({ msg: 'Menu item added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this menu item' }));
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