/*
This is the add driver jsx page, 
it contains all code that handles the creation of a driver and its view in the frontend.


Created by Tyler Costa 19075541
*/

// React imports
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Header import
import UserDashboard from "./UserDashboard"; 
// CSS import for styling
import "../style/AddDriver.css"; 
//Footer import
import Footer from "./sharedComponents/Footer"; 

const AddDriver = () => {
  const navigate = useNavigate();

  // Set the initial state of the driver
  const [driver, setDriver] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle the change of the input fields in real time
  const handleChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  // Handle the submission of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      // Post the driver to the backend
      .post("http://localhost:8082/api/drivers", driver)
      .then((res) => {
        alert(res.data.msg);
        // Redirect to the drivers page
        navigate("/Drivers");
      })
      .catch((err) => alert(err.response.data.error));
  };

  //Return the content that will be displayed
  return (
    <div>
      <UserDashboard /> {/* Display the header */}
      <div>
        <h1>Add a driver</h1>
        <button className="driverButton" onClick={() => navigate("/Drivers")}>
          View Drivers
        </button>
      </div>
        {/* Basic html form that handles the input for driver creation */}
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" onChange={handleChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" onChange={handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddDriver;
