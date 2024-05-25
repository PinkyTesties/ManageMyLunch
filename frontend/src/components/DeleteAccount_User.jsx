import React, { useState, useEffect } from "react";
import axios from "axios";
import UserDashboard from "./UserDashboard";
import "../style/Reports.css";
import Footer from "./sharedComponents/Footer";

const DeleteAccount_User = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const [userRewardPoints, setUserRewardPoints] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.valid) {
          setName(res.data.name);
          setSessionEmail(res.data.email);
          console.log("Email:", res.data.email);
          setUniversity(res.data.university);
          //setUserID(res.data.userId);
          //req.session.userId
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteUser = () => {
    if (!password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
  
    if (
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
          setErrorMessage(data.error);
        } else {
          alert("Account deleted successfully.");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };
  

  return (
    <div>
      <UserDashboard />
      <h1>Delete Account</h1>
      <div className="deleteUserContainer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            deleteUser();
          }}
        >
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
      {errorMessage && <p>{errorMessage}</p>}
        <Footer />
    </div>
  );
};

export default DeleteAccount_User;
