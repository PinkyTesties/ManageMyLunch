const axios = require("axios")
function restaurants() {
    

    axios
    .post("http://localhost:8082/api/restaurants", {
        restaurantName: "",
    cuisine: "",
    rating: "",
    description: "",
      })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = restaurants;