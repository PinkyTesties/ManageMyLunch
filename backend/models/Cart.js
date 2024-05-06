//Cart.js

/*
This is the Cart database Model for Mongo.
Where we store & access Cart account information:
name, restaurant_id, cost, date_created, menuItems which is an array of strings of menu item ids
*/

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  cost: {
    type: String
  },
  date_created: {
    type: Date,
    default: Date.now
  },

  menuItems: {
    type: [
      {
        _id: {
          type: String,
          required: true,
          alias: 'menuItemId'
        },

        cost: {
          type: Number
        },
  
        name: {
          type: String,
          required: true
        },
        
        ingredients: [
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
        ],
        additional_information: {
          type: String
        },

        menuItemImage: {
          type: String,
          required: true
        },

      }
    ]
  },
  
  restaurant_id: {
    type: String,
    required: true
  },

});

module.exports = Cart = mongoose.model('cart', CartSchema);