// routes/api/completedCarts.js

const express = require('express');
const router = express.Router();

// Load completedCart model
const CompletedCart = require('../../models/completedCart');

// @route   POST api/completedCarts
// @desc    Add/save completedCart
// @access  Public
router.post('/', (req, res) => {
  CompletedCart.create(req.body)
    .then(completedCart => res.json({ msg: 'Completed cart added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this completed cart' }));
});

module.exports = router;