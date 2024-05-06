// completedCart.js

const { serialize } = require('mongodb');
const mongoose = require('mongoose');

const CompletedCartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  cost: { type: Number },
  code: { type: Number, required: true },
  date_created: { type: Date, default: Date.now },
  time_created: { type: String, default: () => new Date().toLocaleTimeString() },
  delivery_fee: { type: Number, required: true },
  service_fee: { type: Number, required: true },
  menuItems: { type: [String] },
  restaurant_id: { type: String, required: true },
  restaurant_name: { type: String, required: true },
  additionalInfo: { type: String },
  delivery_date: { type: Date },
  orderStatus: { type: String, default: "Pending" },
  driver_email: { type: String },
  customerName: { type: String },
  delivery_location: { type: String },
});

module.exports = CompletedCart = mongoose.model('completedCart', CompletedCartSchema);