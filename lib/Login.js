const axios = require("axios")
function login() {
    

    axios
    .post("http://localhost:8082/api/login", { email:'1.com',password:'2022' })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = login;