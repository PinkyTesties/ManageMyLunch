import React from 'react';
import axios from 'axios';
import { useAuth } from '../../../../controller/useAuth'

const DeleteAccount = () => {
  const { token } = useAuth(); // Get the token from your auth context

  const deleteUser = () => {
    axios
      .delete(`http://localhost:8082/api/users/delete`, {
        headers: {
          'Authorization': `Bearer ${token}` // Send the token in the Authorization header
        }
      })
      .then(response => {
        if (response.data.msg) {
          alert(response.data.msg);
        } else if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch(error => alert('Error:', error));
  };

  

  return (
    <div>
      <h1>Delete Account</h1>
      <button onClick={deleteUser}>Delete Account</button>
    </div>
  );
}

export default DeleteAccount;