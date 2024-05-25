import React, { useState, useEffect } from "react";
import UserDashboard from "./UserDashboard"; // Import UserDashboard
import "../style/UpdatePassword.css"; // Import the CSS file
import Footer from "./sharedComponents/Footer";
function UpdatePassword() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");

  const fetchUsers = () => {
    fetch("http://localhost:8082/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    const user = users.find(
      (user) =>
        user.email === selectedUserEmail || user.name === selectedUserEmail
    );

    if (user) {
      if (user.password === newPassword) {
        setErrorMessage("Can't use the old password"); // Display error message if the new password is the same as the old password
        alert("Cannot use the previous password");
        return;
      }

      // Ask the user for confirmation before updating the password
      const confirmUpdate = window.confirm(
        "Are you sure you want to update the password?"
      );
      if (!confirmUpdate) {
        return; // If the user clicks "Cancel", stop the function
      }

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
          setSelectedUserEmail("");
          setNewPassword("");
          setSuccessMessage("Password updated successfully");
          setErrorMessage("");
          fetchUsers(); // Refresh the users
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          setSuccessMessage("");
          setErrorMessage("Error updating password");
        });
    } else {
      setErrorMessage("Incorrect email or username"); // Display error message if the user is not found
    }
  };

  return (
    <div classname='wholePage'>
      <UserDashboard /> {/* Use UserDashboard */}
      <h1>Reset your password</h1>
      <div className="passwordContainer">
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}{" "}
      {/* Display error message if there is any */}
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
      <Footer></Footer>
    </div>
  );
}

export default UpdatePassword;
