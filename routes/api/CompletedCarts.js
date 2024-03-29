const express = require('express');
const router = express.Router();

// Load completedCart model
const CompletedCart = require('../../models/completedCart');

// @route   POST api/completedCarts
// @desc    Add/save completedCart
// @access  Public
router.post('/', (req, res) => {
  console.log(req.body)
  CompletedCart.create(req.body)
    .then(completedCart => res.json({ msg: 'Completed cart added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this completed cart' }));
});

// Get all completed carts by email
router.get('/:email', async (req, res) => {
  const completedCarts = await CompletedCart.find({ email: req.params.email });
  if (!completedCarts.length) {
    return res.status(200).json({ message: 'No completed carts found for this email' });
  }
  res.json(completedCarts);
});

router.put('/:email', async (req, res) => {
  const updatedCart = await CompletedCart.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
  if (!updatedCart) {
    return res.status(404).json({ message: 'Completed cart not found' });
  }
  res.json(updatedCart);
});

module.exports = router;