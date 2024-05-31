/*
This is CompletedCarts.js
This is the api code for the completed carts. It is used to create, get, update and delete completed carts.

IT is based on Books.js from Logrocket's MERN stack tutorial: https://blog.logrocket.com/mern-stack-tutorial/

*/

const express = require('express');
const router = express.Router();

// use completedCart model
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

// @route   GET api/completedCarts/email
// @desc    get completed carts by email
// @access  Public
router.get('/:email', async (req, res) => {
  const completedCarts = await CompletedCart.find({ email: req.params.email });
  if (!completedCarts.length) {
    return res.status(200).json({ message: 'No completed carts found for this email' });
  }
  res.json(completedCarts);
});

// @route   PUT api/completedCarts/email
// @desc    update  completedCart by email
// @access  Public
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
    { 
      orderStatus: req.body.orderStatus,
      driver_email: req.body.driver_email
    },
    { new: true }
  );

  if (!updatedCart) {
    return res.status(404).json({ message: 'Completed cart not found' });
  }

  res.json(updatedCart);
});

// @route   GET api/id/:id
// @desc    get cart by user ID
// @access  Public
router.get('/id/:id', async (req, res) => {
  const completedCart = await CompletedCart.findById(req.params.id);
  if (!completedCart) {
    return res.status(404).json({ message: 'No completed cart found for this ID' });
  }
  res.json(completedCart);
});

// @route   PUT api/id/id
// @desc    update comlpelted cart by ID
// @access  Public
router.put('/id/:id', async (req, res) => {
  const updatedCart = await CompletedCart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedCart) {
    return res.status(404).json({ message: 'Completed cart not found' });
  }
  res.json(updatedCart);
});

// @route   DELETE api/completedCarts/id
// @desc    delete completed cart by ID
// @access  Public
router.delete('/id/:id', async (req, res) => {
  const deletedCart = await CompletedCart.findByIdAndDelete(req.params.id);
  if (!deletedCart) {
    return res.status(404).json({ message: 'No completed cart found with this ID' });
  }
  res.json({ message: 'Completed cart deleted successfully' });
});

// @route   GET api/completedCarts/
// @desc    get all completedCarts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const completedCarts = await CompletedCart.find({});
    res.json(completedCarts);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching completed carts' });
  }
});

// @route   GET api/completedCarts/code/:code
// @desc    Get a completed cart by code and status
// @access  Public
router.get('/code/:code', async (req, res) => {
  const code = parseInt(req.params.code, 10);
  const completedCart = await CompletedCart.findOne({ code: code, orderStatus: "Delivered" });
  if (!completedCart) {
    return res.status(404).json({ message: 'No completed cart found for this code' });
  }
  res.json(completedCart);
});

// @route   GET api/completedCarts/status/:status
// @desc    Get a completed cart by status
// @access  Public
router.get('/status/:status', async (req, res) => {
  const completedCarts = await CompletedCart.find({ orderStatus: req.params.status });
  if (!completedCarts.length) {
    return res.status(200).json({ message: 'No completed carts found for this status' });
  }
  res.json(completedCarts);
});

// @route   PUT api/completedCarts/complete/:id
// @desc    update a completed cart by id
// @access  Public
router.put('/complete/:id', async (req, res) => {
  const updatedCart = await CompletedCart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedCart) {
    return res.status(404).json({ message: 'Completed cart not found' });
  }
  res.json(updatedCart);
});


module.exports = router;