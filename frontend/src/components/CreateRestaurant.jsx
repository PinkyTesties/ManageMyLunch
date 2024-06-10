/*
THis is the CreateRestaurant component which is used to add a new restaurant to the database. 
The user can input the restaurant name, cuisine, address, latitude, longitude, rating, description, and image of the restaurant.

Created by Tyler Costa 19075541
*/

//React imports
import React, { useState } from "react";
import axios from "axios";
import logo from "./componentAssets/logov1.png";
import { useNavigate } from "react-router-dom";
//Header
import UserDashboard from "./UserDashboard";
//Footer
import Footer from "./sharedComponents/Footer";

const CreateRestaurant = (props) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  // Create a restaurant object similar to the restaurant.js model
  const [restaurant, setRestaurant] = useState({
    restaurantName: "",
    cuisine: "",
    address: "",
    latitude: "",
    longitude: "",
    rating: "",
    description: "",
    restaurantImage: "",
  });

  // Handle input changes
  const onChange = (e) => {
    if (e.target.name === "image") {
      setImage(e.target.files[0]);
    } else {
      setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    }
  };

  //Submit handler, submits object to backend. Alerts the user that it was successful
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(restaurant).forEach((key) =>
      formData.append(key, restaurant[key])
    );
    formData.append("image", image);

    axios
      .post("http://localhost:8082/api/restaurants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // handle success
        alert("Restaurant added successfully!");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Error in CreateRestaurant!");
      });
  };

  //Render the form to the page with input fields for the user to input the restaurant details
  return (
<<<<<<< HEAD
    <div className="CreateRestaurant">
      <header>
            <img src={logo} alt="Logo" height={100} />
            <h1>Add Restaurant</h1>
            <Link to="/dashboard" className="btn btn-outline-warning float-left">
              Show Restaurant List
            </Link>
            </header>
            <hr />
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <br />
            <p className="lead text-center">Create new Restaurant</p>
          </div>
          <div className="col-md-10 m-auto">
            
            <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="restaurantName">Name:</label>

                <input
                  type="text"
                  placeholder="Name"
                  name="restaurantName"
                  className="form-control"
                  value={restaurant.restaurantName}
                  onChange={onChange}
                />
              </div>
=======
    <div>
      <UserDashboard />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="CreateRestaurant">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
>>>>>>> origin/main
              <br />
              <button onClick={() => navigate("/Dashboard")}>Dashboard</button>
            </div>
            <div className="col-md-10 m-auto">
              <h1 className="display-4 text-center">Add Restaurant</h1>
              <p className="lead text-center">Create new Restaurant</p>
              <form noValidate onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="restaurantName">Name:</label>

                  <input
                    type="text"
                    placeholder="Name"
                    name="restaurantName"
                    className="form-control"
                    value={restaurant.restaurantName}
                    onChange={onChange}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="cuisine">Cuisine:</label>

                  <input
                    type="text"
                    placeholder="e.g: Chinese"
                    name="cuisine"
                    className="form-control"
                    value={restaurant.cuisine}
                    onChange={onChange}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="cuisine">Address:</label>

                  <input
                    type="text"
                    placeholder="e.g: 123 Fake St."
                    name="address"
                    className="form-control"
                    value={restaurant.address}
                    onChange={onChange}
                  />
                  <input
                    type="text"
                    placeholder="Latitude"
                    name="latitude"
                    className="form-control"
                    value={restaurant.latitude}
                    onChange={onChange}
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    name="longitude"
                    className="form-control"
                    value={restaurant.longitude}
                    onChange={onChange}
                  />
                </div>
                <br></br>
                <div className="form-group">
                  <label htmlFor="rating">Star Rating:</label>

                  <input
                    type="text"
                    placeholder="e.g 3"
                    name="rating"
                    className="form-control"
                    value={restaurant.rating}
                    onChange={onChange}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="description">Description:</label>

                  <input
                    type="text"
                    placeholder="Describe this restaurant"
                    name="description"
                    className="form-control"
                    value={restaurant.description}
                    onChange={onChange}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="image">Image:</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control"
                    onChange={onChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-warning btn-block mt-4 mb-4 w-100"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
};

export default CreateRestaurant;
