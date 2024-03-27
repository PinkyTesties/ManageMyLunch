const axios = require("axios")
function MenuItemPanel() {
    

    axios
    .post('http://localhost:8082/api/cart/add', {
        email: 'email',
        menuItem: 'menuItem',
        quantity: 'quantity',
        restaurant_id: 'menuItem.restaurant_id' 
      })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = MenuItemPanel;