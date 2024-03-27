const axios = require("axios")
function cart() {
    

    axios
    .post("http://localhost:8082/api/completedCarts", {
      email: 'email',
      cost: 'cart.cost',
      date_created: 'cart.date_created',
      menuItems: 'cart.menuItems',
      restaurant_id: 'cart.restaurant_id',
      restaurant_name: 'restaurantName',
      additionalInfo: 'additionalInfo',
      })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = cart;