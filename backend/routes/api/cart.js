/*
This is cart.js
This is the api code for the cart. It is used to create, get, update and delete carts.

Created by Tyler Costa 19075541
*/

const express = require('express');
const router = express.Router();

const Cart = require('../../models/Cart'); 

// Create a new cart
router.post('/', async (req, res) => {
  const newCart = new Cart(req.body);
  const savedCart = await newCart.save();

  res.json(savedCart);
});

// Get all carts
router.get('/', async (req, res) => {
  const carts = await Cart.find();
  res.json(carts);
});

// Get a specific cart by email
router.get('/:email', async (req, res) => {
  const cart = await Cart.findOne({ email: req.params.email });
  if (!cart) {
    return res.status(200).json({ message: 'Cart not found' });
  }
  res.json(cart);
});

// Update a cart by ID
router.put('/:id', async (req, res) => {
  const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCart);
});

// Update a cart by email
router.put('/:email', async (req, res) => {
  
  const updatedCart = await Cart.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
  if (!updatedCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  res.json(updatedCart);
});

// Delete a cart by ID
router.delete('/:id', async (req, res) => {
  const deletedCart = await Cart.findByIdAndDelete(req.params.id);
  res.json(deletedCart);
});
// Add an item to a cart
router.post('/add', async (req, res) => {
  const { email, menuItem, quantity, restaurant_id } = req.body;

  // Try to find the cart with the provided email
  let cart = await Cart.findOne({ email: email });

  if (cart) {
    // If a cart was found, add the new item to the menuItems array and update the cost
    cart.menuItems.push(menuItem);
    cart.cost += menuItem.cost * quantity;
    cart.restaurant_id = restaurant_id; 
  } else {
    // If no cart was found, create a new one
    cart = new Cart({
      email: email,
      menuItems: [menuItem],
      cost: menuItem.cost * quantity,
      restaurant_id: restaurant_id 
    });
  }

  // Save the updated or new cart
  const savedCart = await cart.save();

  res.json(savedCart);
});

// Delete a cart by email
router.delete('/:email', async (req, res) => {
  const deletedCart = await Cart.findOneAndDelete({ email: req.params.email });
  if (!deletedCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  res.json(deletedCart);
});

/// Remove an item from a cart
router.put('/remove/:email', async (req, res) => {
  const { menuItemId, index } = req.body;

  const updatedCart = await Cart.findOneAndUpdate(
    { email: req.params.email },
    { $unset: { [`menuItems.${index}`]: 1 } },
    { new: true }
  );

  if (updatedCart) {
    await Cart.findOneAndUpdate(
      { email: req.params.email },
      { $pull: { menuItems: null } },
      { new: true }
    );
  } else {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.json(updatedCart);
});

module.exports = router;