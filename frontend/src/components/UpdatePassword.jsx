<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import logo from './componentAssets/logov1.png';
=======
/*
UpdatePassword.jsx

This is the update password page
It allows the admin change the password of a selected user
If logged in as regular user, you can only change your own password

Created by Tyler Costa 19075541
*/

//React imports
import React, { useState, useEffect } from "react";
import axios from "axios";

//Header
import UserDashboard from "./UserDashboard";
//Styles
import "../style/UpdatePassword.css";
//Footer
import Footer from "./sharedComponents/Footer";
>>>>>>> origin/main

function UpdatePassword() {
  //Variables
  const [users, setUsers] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
const [newManualPassword, setNewManualPassword] = useState('');
  //Fetch the user details from the session
  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setEmail(res.data.email);
          console.log("Email:", res.data.email);
          setUniversity(res.data.university);
        } else {
          //If not logged in. Send back to homepage
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //Fetching user admin status using the logged in email
  useEffect(() => {
    if (email) {
      const fetchUserAdminStatus = async () => {
        const response = await fetch(`http://localhost:8082/api/users/email/${email}`);
        const data = await response.json();

        console.log(data);

        setIsAdmin(data.isAdmin);
      };

      fetchUserAdminStatus();
    }
  }, [email]);

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
  
    const loggedInUser = users.find(user => user.email === email);
  
    const user = users.find(
      (user) =>
        user.email === selectedUserEmail || user.name === selectedUserEmail
    );
  
    // Prevent users from updating other users' passwords
    if (user) {
      if (!loggedInUser.isAdmin && loggedInUser.email !== selectedUserEmail) {
        alert("You can only update your own password");
        return;
      }
  
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
<<<<<<< HEAD
    <div>
      <header>
      <img src={logo} alt='Logo' height={100} />
      <h1>Reset your password</h1>
<<<<<<< HEAD:frontend/manage_my_lunch/src/components/UpdatePassword.jsx
      <p></p>
      </header>
      <div className='delete-user'>
=======
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>} {/* Display error message if there is any */}
>>>>>>> b944fe787571675b27498ea2457756757baa57af:frontend/src/components/UpdatePassword.jsx
=======
    <div classname='wholePage'>
      {/* Header */}
      <UserDashboard /> 
      <h1>Reset your password</h1>
      <div className="passwordContainer">
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}{" "}
      {/* Display error message here */}
>>>>>>> origin/main
      <form onSubmit={handlePasswordUpdate}>
        
        <input
        className="input-small"
          type="text"
          value={selectedUserEmail}
          onChange={(e) => setSelectedUserEmail(e.target.value)}
          placeholder="Enter user email"
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

      <div>
 
</div>
      {/**Display users in boxes, but only for admin*/}
    {isAdmin && (
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
<<<<<<< HEAD
      </ul>
      </div>
      
=======
      </div>
      )}
      </div>
      {/**Footer */}
      <Footer />
>>>>>>> origin/main
    </div>
  );
}

export default UpdatePassword;
