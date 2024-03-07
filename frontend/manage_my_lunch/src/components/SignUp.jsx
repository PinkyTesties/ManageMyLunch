// SignUp.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/*
Name
Email
Password
Confirm password

This page follows similar format to CreateBook.jsx from CISE week 3 lab
*/
const SignUp = (props) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        date_added: "",
        university: "",
        updated_date: "",


      });

      const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
      };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("On submit clicked!");
    console.log("user object: ", user);

    axios
    .post("http://localhost:8082/api/users", user)
    .then((res) => {
      setUser({
        name: "",
        email: "",
        password: "",
        //date_added: "",
        university: "",
        //updated_date: "",
      });
      navigate("/");
    })
    .catch((err) => {
      console.log("Error in CreateUser:", err.response.data); // Log the error response
    });
  
      


    // Here you can add sign-up logic, such as sending a request to your backend
    // to create a new user with the provided email and password
   // console.log("Signing up with:", email, password);
    // After successful sign-up, you can redirect the user to another page
    // For now, redirecting back to the login page
   // window.location.href = "/login"; // Assuming route to LoginPage.jsx is "/login"
  };

  return (

            <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
              <p>***THIS PAGE STILL REQUIRES CSS. DO NOT SUBMIT AS IS***</p>

              <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  placeholder="name"
                  name="name"
                  className="form-control"
                  value={user.name}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
              <label htmlFor="email">Email:</label>

                <input
                  type="text"
                  id="email"
                  placeholder="email"
                  name="email"
                  className="form-control"
                  value={user.email}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
              <label htmlFor="password">Password:</label>

                <input
                  type="password"
                  id="password"
                  //placeholder=""
                  name="password"
                  className="form-control"
                  value={user.password}
                  onChange={onChange}
                />
              </div>
              <br />
 
              <br />
              <div className="form-group">
              <label htmlFor="date_added">Date:</label>

                <input
                  type="date"
                  id="date"
                  placeholder=""
                  name="date_added"
                  className="form-control"
                  value={user.date_added}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
              <label htmlFor="university">University:</label>

                <input
                  type="text"
                  id="University"
                  placeholder="University"
                  name="university"
                  className="form-control"
                  value={user.university}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
              <label htmlFor="updated_date">Updated Date:</label>
                <input
                  type="date"
                  id="updated_date"
                  placeholder=""
                  name="updated_date"
                  className="form-control"
                  value={user.updated_date}
                  onChange={onChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
        Already have an account? <Link to="/" className="btn btn-link">Login</Link>
      </form>


  );
};

export default SignUp;
