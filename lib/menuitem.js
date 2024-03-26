const axios = require("axios")
function menuitem() {
    

    axios
    .post("http://localhost:8082/api/menuItems", {
        name: "1",
    cost: "1",
    date_added: new Date(),
    item_desc: "",
    restaurant_id: 'id',
    ingredients: []
      })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = menuitem;