/*
This page is used to delete the user account. The user must enter their password to confirm the deletion of their account.

The user cannot undo this action. The user will be redirected to the login page after the account is deleted.
The user can onloy delete their own account. And will be prompted to confirm the deletion of their account.

Created by:
Tyler Costa 19075541
*/

//React imports
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

//Header
import UserDashboard from "./UserDashboard";
//Styles
import "../style/Reports.css";
//Footer
import Footer from "./sharedComponents/Footer";

const DeleteAccount_User = () => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");

  const navigate = useNavigate();

  //Fetching and setting of session variables
  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setSessionEmail(res.data.email);
          console.log("Email:", res.data.email);
          setUniversity(res.data.university);

        } else {
          //If not logged in. Send back to homepage
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //Function to delete the user account
  const deleteUser = () => {
    if (!password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
  
    if (
      //Prompt user to confirm deletion
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      
      fetch(`http://localhost:8082/api/users/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sessionEmail, password }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          //Delete failed, display error message
          setErrorMessage(data.error);
        } else {
          //Successfull deletion, redirect to login page
          alert("Account deleted successfully.");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };
  
//Render the delete account form
  return (
    <div>
      {/* Header */}
      <UserDashboard />
      <h1>Delete Account</h1>
      <div className="deleteUserContainer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            deleteUser();
          }}
        >
          {/* Email and password fields, email is read only so that it cannot be edited */}
          <input type="email" value={sessionEmail} readOnly />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Delete Account</button>
        </form>
      </div>
      {/* Error message */}
      {errorMessage && <p>{errorMessage}</p>}
      {/* Footer */}
        <Footer />
    </div>
  );
};

export default DeleteAccount_User;
