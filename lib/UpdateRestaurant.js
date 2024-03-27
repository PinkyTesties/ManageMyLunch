const axios = require("axios")
function UpdateRestaurant() {
    const data = {
        restaurantName: 'restaurant.restaurantName',
        cuisine: 'restaurant.cuisine',
        rating: 'restaurant.cuisine',
        description: 'restaurant.description',
  
      };

    axios
    .put(`http://localhost:8082/api/restaurants/1`, data)
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = UpdateRestaurant;