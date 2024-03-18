import React, { useState, useEffect } from "react";
import { Link, useParams} from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateMenuItem = (props) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract id from the URL

  const [menuItem, setMenuItem] = useState({
    name: "",
    cost: "",
    date_added: new Date(),
    item_desc: "",
    restaurant_id: id, // Use the id from the URL
  });

  const [restaurant, setRestaurant] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const onChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8082/api/menuItems", menuItem)
      .then((res) => {
        setMenuItem({
          name: "",
          cost: "",
          date_added: new Date(),
          item_desc: "",
          restaurant_id: id,
        });
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h3>Create New Menu Item</h3>
      <p>Restaurant ID: {id}</p>
      <p>Restaurant Name: {restaurant.restaurantName}</p> {/* Display the restaurant name */}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name: </label>
          <input type="text" required className="form-control" name="name" value={menuItem.name} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Cost: </label>
          <input type="text" className="form-control" name="cost" value={menuItem.cost} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Description: </label>
          <input type="text" className="form-control" name="item_desc" value={menuItem.item_desc} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Restaurant ID: </label>
          <input type="text" required className="form-control" name="restaurant_id" value={menuItem.restaurant_id} onChange={onChange} />
        </div>
        <div className="form-group">
          <input type="submit" value="Create Menu Item" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default CreateMenuItem;


/*

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
            <h1 className="display-4 text-center">Menu Item</h1>
            <p className="lead text-center">Add a new menu item</p>
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


*/