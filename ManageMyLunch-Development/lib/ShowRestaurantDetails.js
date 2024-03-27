const axios = require("axios")
function ShowRestaurantDetails() {
    

    axios
    .get(`http://localhost:8082/api/restaurants/1`)
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = ShowRestaurantDetails;