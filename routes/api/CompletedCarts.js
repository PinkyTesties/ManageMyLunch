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

// @route   PUT api/completedCarts/status/:id
// @desc    Update order status of a completed cart by ID
// @access  Public
router.put('/status/:id', async (req, res) => {
  const updatedCart = await CompletedCart.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.orderStatus },
    { new: true }
  );

  if (!updatedCart) {
    return res.status(404).json({ message: 'Completed cart not found' });
  }

  res.json(updatedCart);
});

// Get a completed cart by ID
router.get('/id/:id', async (req, res) => {
  const completedCart = await CompletedCart.findById(req.params.id);
  if (!completedCart) {
    return res.status(404).json({ message: 'No completed cart found for this ID' });
  }
  res.json(completedCart);
});

router.put('/id/:id', async (req, res) => {
  const updatedCart = await CompletedCart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedCart) {
    return res.status(404).json({ message: 'Completed cart not found' });
  }
  res.json(updatedCart);
});

router.delete('/id/:id', async (req, res) => {
  const deletedCart = await CompletedCart.findByIdAndDelete(req.params.id);
  if (!deletedCart) {
    return res.status(404).json({ message: 'No completed cart found with this ID' });
  }
  res.json({ message: 'Completed cart deleted successfully' });
});

// Get all completed carts
router.get('/', async (req, res) => {
  try {
    const completedCarts = await CompletedCart.find({});
    res.json(completedCarts);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching completed carts' });
  }
});

// Get a completed cart by code and status
router.get('/code/:code', async (req, res) => {
  const code = parseInt(req.params.code, 10);
  const completedCart = await CompletedCart.findOne({ code: code, orderStatus: "Delivered" });
  if (!completedCart) {
    return res.status(404).json({ message: 'No completed cart found for this code' });
  }
  res.json(completedCart);
});

// Get all completed carts by status
router.get('/status/:status', async (req, res) => {
  const completedCarts = await CompletedCart.find({ orderStatus: req.params.status });
  if (!completedCarts.length) {
    return res.status(200).json({ message: 'No completed carts found for this status' });
  }
  res.json(completedCarts);
});

router.put('/complete/:id', async (req, res) => {
  const updatedCart = await CompletedCart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedCart) {
    return res.status(404).json({ message: 'Completed cart not found' });
  }
  res.json(updatedCart);
});

module.exports = router;