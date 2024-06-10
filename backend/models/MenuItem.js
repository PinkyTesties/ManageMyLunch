//MenuItem.js

/*
This is the MenuItem database Model for Mongo.
Where we store & access MenuItem account information:
name, restaurant_id,  date_added, item_desc, menuItemImage, ingredients, additional_information

Ingredients is an array of objects, each object representing an ingredient in the menu item.
In the ingredients array, each object contains a name and quantity attribute.

Tyler Costa 19075541
*/

const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  cost: {
    type: Number
  },
  
  date_added: {
    type: Date,
    default: Date.now
  },
  item_desc: {
    type: String
  },

  menuItemImage: {
    type: String,
    required: true
  },

  ingredients: {
    type: [
      {
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  },

  additional_information: {
    type: String
  },

  restaurant_id: {
    type: String,
    required: true
  },

});



module.exports = MenuItem = mongoose.model('menuItem', MenuItemSchema);