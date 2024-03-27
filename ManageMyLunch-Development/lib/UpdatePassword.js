const axios = require("axios")
function UpdatePassword() {
    

    axios
    fetch(`http://localhost:8082/api/users/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'newPassword',
        }),
      })
    .then((res) => {
      
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });

  }
  module.exports = UpdatePassword;