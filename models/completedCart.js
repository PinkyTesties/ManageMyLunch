// completedCart.js

const mongoose = require('mongoose');

const CompletedCartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  cost: { type: String },
  date_created: { type: Date, default: Date.now },
  menuItems: { type: [String] },
  restaurant_id: { type: String, required: true },
  restaurant_name: { type: String, required: true },
  additionalInfo: { type: String },
});

module.exports = CompletedCart = mongoose.model('completedCart', CompletedCartSchema);