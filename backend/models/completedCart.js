// completedCart.js

const mongoose = require('mongoose');

const CompletedCartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  cost: { type: Number },
  code: { type: Number, required: true },
  date_created: { type: Date, default: Date.now },
  time_created: { type: String, default: () => new Date().toLocaleTimeString() },

  menuItems: { type: [String] },
  restaurant_id: { type: String, required: true },
  restaurant_name: { type: String, required: true },
  additionalInfo: { type: String },
  orderStatus: { type: String, default: "Pending" },
  driver_email: { type: String },
});

module.exports = CompletedCart = mongoose.model('completedCart', CompletedCartSchema);