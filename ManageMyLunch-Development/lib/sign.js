const axios = require("axios")
function sign() {
    

    axios
    .post("http://localhost:8082/api/users", {
        name: "111",
        email: "111",
        password: "111",
        university: "111",
      })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = sign;