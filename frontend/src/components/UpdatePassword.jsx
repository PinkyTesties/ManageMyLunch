/*
UpdatePassword.jsx

This is the update password page
It allows the admin change the password of a selected user

Created by Tyler Costa 19075541
*/

//React imports
import React, { useState, useEffect } from "react";
//Header
import UserDashboard from "./UserDashboard";
//Styles
import "../style/UpdatePassword.css";
//Footer
import Footer from "./sharedComponents/Footer";

function UpdatePassword() {
  //Variables
  const [users, setUsers] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  //Fetch the users
  const fetchUsers = () => {
    fetch("http://localhost:8082/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  //Function to handle updating the password
  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    const user = users.find(
      (user) =>
        user.email === selectedUserEmail || user.name === selectedUserEmail
    );

    if (user) {
      if (user.password === newPassword) {
        // Display error message if the new password is the same as the old password
        setErrorMessage("Can't use the old password"); 
        alert("Cannot use the previous password");
        return;
      }

      // Ask the user for confirmation before updating the password
      const confirmUpdate = window.confirm(
        "Are you sure you want to update the password?"
      );
      if (!confirmUpdate) {
        //Cancel
        return; 
      }

      //Update the password of the selected user in the database
      fetch(`http://localhost:8082/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(users.map((user) => (user._id === data._id ? data : user)));
          //Reset the form and display a success message
          setSelectedUserEmail("");
          setNewPassword("");
          setSuccessMessage("Password updated successfully");
          setErrorMessage("");
          //refresh the users
          fetchUsers(); 
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          setSuccessMessage("");
          setErrorMessage("Error updating password");
        });
    } else {
      // Display error message if the user does not exist
      setErrorMessage("Incorrect email or username"); 
    }
  };

  //Render the update password page
  return (
    <div classname='wholePage'>
      {/* Header */}
      <UserDashboard /> 
      <h1>Reset your password</h1>
      <div className="passwordContainer">
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}{" "}
      {/* Display error message here */}
      <form onSubmit={handlePasswordUpdate}>
        <input
        className="input-small"
          type="text"
          value={selectedUserEmail}
          onChange={(e) => setSelectedUserEmail(e.target.value)}
          placeholder="Email"
          required
        />
        
        <input
        className="input-small" 
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button className='update-button'type="submit">Update Password</button>
      </form>
      {/**Display users in boxes */}
      <div className="user-grid">
        {users.map((user) => (
          <div key={user._id} className="user-box">
            <p>User ID: {user._id}</p>
            <p>Username: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Password: {user.password}</p>
            <button
              className="userSelect"
              onClick={() => setSelectedUserEmail(user.email)}
            >
              Select User
            </button>{" "}
          </div>
        ))}
      </div>
      </div>
      {/**Footer */}
      <Footer />
    </div>
  );
}

export default UpdatePassword;
