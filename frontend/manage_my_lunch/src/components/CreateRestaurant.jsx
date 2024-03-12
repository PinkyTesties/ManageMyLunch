import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRestaurant = (props) => {
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    restaurantName: "",
    cuisine: "",
    rating: "",
    description: "",
  });

  const onChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
    //Link should change to a deployed backend host
      .post("http://localhost:8082/api/restaurants", restaurant)
      .then((res) => {
        setRestaurant({
          restaurantName: "",
          cuisine: "",
          rating: "",
          description: "",

        });
        // Push to /
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Error in CreateRestaurant!");
      });
  };

  return (
    <div className="CreateRestaurant">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <br />
            <Link to="/" className="btn btn-outline-warning float-left">
              Show Restaurant List
            </Link>
          </div>
          <div className="col-md-10 m-auto">
            <h1 className="display-4 text-center">Add Restaurant</h1>
            <p className="lead text-center">Create new Restaurant</p>
            <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
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
  );
};

export default CreateRestaurant;