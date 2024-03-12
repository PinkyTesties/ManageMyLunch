//MenuItem.js

/*
This is the MenuItem database Model for Mongo.
Where we store & access MenuItem account information:
name, restaurant_id, cost, date_added, item_desc
*/

const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  restaurant_id: {
    type: String,
    required: true
  },
  cost: {
    type: String
  },
  date_added: {
    type: Date,
    default: Date.now
  },
  item_desc: {
    type: String
  },

});

module.exports = MenuItem = mongoose.model('menuItem', MenuItem);