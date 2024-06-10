//Cart.js

/*
This is the Cart database Model for Mongo.
Where we store & access Cart account information: email, cost, date_created, menuItems, restaurant_id. 

The menuItems field is an array of objects, each object representing a menu item in the cart.
- Array contains: _id, cost, name, ingredients, additional_information, menuItemImage
Within that array is another array of objects, each object representing an ingredient in the menu item.
- Array contains: name, quantity

Tyler Costa 19075541

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

  // Array of objects, each object representing a menu item in the cart
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
        
        // Array of objects, each object representing an ingredient in the menu item
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