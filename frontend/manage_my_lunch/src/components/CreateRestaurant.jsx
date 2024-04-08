import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRestaurant = (props) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const [restaurant, setRestaurant] = useState({
    restaurantName: "",
    cuisine: "",
    address: "",
    rating: "",
    description: "",
    restaurantImage: "",
  });

  const onChange = (e) => {
    if (e.target.name === 'image') {
      setImage(e.target.files[0]);
    } else {
      setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    }
  };


  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
Object.keys(restaurant).forEach((key) => formData.append(key, restaurant[key]));
formData.append('image', image);

axios
  .post("http://localhost:8082/api/restaurants", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then((res) => {
    // handle success
    alert("Restaurant added successfully!");
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
            <Link to="/dashboard" className="btn btn-outline-warning float-left">
              Show Restaurant List
            </Link>
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
  );
};

export default CreateRestaurant;