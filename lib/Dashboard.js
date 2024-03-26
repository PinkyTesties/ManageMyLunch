const axios = require("axios")
function Dashboard() {
    

    axios
    .get("http://localhost:8082")
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = Dashboard;