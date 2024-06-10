/*
This is the completedCart.js model
It is used to store the completed cart information in the database

The attributes are: email, cost, code, date_created, time_created, delivery_fee, service_fee, 
menuItems, restaurant_id, restaurant_name, additionalInfo, delivery_date, orderStatus, driver_email, 
customerName, delivery_location

This is also where the default order status is set to "Pending" when an order is placed

Tyler Costa 19075541
*/
const mongoose = require("mongoose");

const CompletedCartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  cost: {
    type: Number,
  },

  code: {
    type: Number,
    required: true,
  },

  date_created: {
    type: Date,
    default: Date.now,
  },

  time_created: {
    type: String,
    default: () => new Date().toLocaleTimeString(),
  },

  delivery_fee: {
    type: Number,
    required: true,
  },

  service_fee: {
    type: Number,
    required: true,
  },

  menuItems: {
    type: [String],
  },

  restaurant_id: {
    type: String,
    required: true,
  },

  restaurant_name: {
    type: String,
    required: true,
  },

  additionalInfo: {
    type: String,
  },

  delivery_date: {
    type: Date,
  },

  //Sets the default order status to "Pending" when an order is placed
  orderStatus: {
    type: String,
    default: "Pending",
  },

  driver_email: {
    type: String,
  },

  customerName: {
    type: String,
  },

  delivery_location: {
    type: String,
  },
});

module.exports = CompletedCart = mongoose.model(
  "completedCart",
  CompletedCartSchema
);
