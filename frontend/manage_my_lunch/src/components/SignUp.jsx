import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from './componentAssets/logov1.png';
import { ToastContainer, toast } from 'react-toastify';
import { set } from "mongoose";


// Define the initial state values for the user object
const SignUp = (props) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    createdAt: "",
  });
  // Define the user object
  const { name, email, password, confirmpassword, createdAt } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleSubmit = (err) => {
    toast.error(err, {
      position: "bottom-right",
    });
    const handleSuccess = (msg) => {
      toast.success(msg, {
        position: "bottom-right",
      });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post("http://localhost:8082/signup",
          {
            inputValue,
          },
          { withCredentials: true }
        );
        const { success, message } = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          handleErrors(message);
        }
      } catch (error) {
        console.error(error);
      }
      setInputValue({
        inputValue,
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        createdAt: "",
      });
    };


    //     const onChange = (e) => {
    //       setUser({ ...user, [e.target.name]: e.target.value });
    //     };

    // const onSubmit = (e) => {
    //   e.preventDefault();
    //   console.log("On submit clicked!");
    //   console.log("user object: ", user);

    //   axios
    //   .post("http://localhost:8082/api/users", user)
    //   .then((res) => {
    //     setUser({
    //       name: "",
    //       email: "",
    //       password: "",
    //       //date_added: "",
    //       university: "",
    //       //updated_date: "",
    //     });
    //     navigate("/");
    //   })
    //   .catch((err) => {
    //     console.log("Error in CreateUser:", err.response.data); // Log the error response
    //   });




    // Here you can add sign-up logic, such as sending a request to your backend
    // to create a new user with the provided email and password
    // console.log("Signing up with:", email, password);
    // After successful sign-up, you can redirect the user to another page
    // For now, redirecting back to the login page
    // window.location.href = "/login"; // Assuming route to LoginPage.jsx is "/login"
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="form-group">
        <img src={logo} alt='Logo' height={100} />
        <h1>Sign Up to Manage My Lunch</h1>
        <p>***THIS PAGE STILL REQUIRES CSS. DO NOT SUBMIT AS IS***</p>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          placeholder="Enter Your Name"
          name="name"
          className="form-control"
          value={inputValue.name}
          onChange={handleOnChange}
        />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="email">Email:</label>

        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          className="form-control"
          value={inputValue.email}
          onChange={handleOnChange}
        />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="password">Password:</label>

        <input
          type="password"
          id="password"
          placeholder="Enter Your Password"
          name="password"
          className="form-control"
          value={inputValue.password}
          onChange={handleOnChange}
        />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="confirmpassword">Confirm Password:</label>

        <input
          type="password"
          id="password"
          placeholder="Confirm Your Password"
          name="confirmpassword"
          className="form-control"
          value={inputValue.confirmpassword}
          onChange={handleOnChange}
        />
      </div>
      <br />
      <div className="form-group">
        {/* <label htmlFor="date_added">Date:</label>

                <input
                  type="date"
                  id="date"
                  placeholder=""
                  name="date_added"
                  className="form-control"
                  value={user.date_added}
                  onChange={onChange}
                /> */}
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
          value={inputValue.university}
          onChange={handleOnChange}
        />
      </div>
      <div className="form-group">
        {/* <label htmlFor="updated_date">Updated Date:</label>
                <input
                  type="date"
                  id="updated_date"
                  placeholder=""
                  name="updated_date"
                  className="form-control"
                  value={user.updated_date}
                  onChange={onChange}
                /> */}
      </div>
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
      Already have an account? <Link to="/" className="btn btn-link">Login</Link>
      <br></br><br></br>
      <button>Sign up as driver</button>
      <ToastContainer />
    </form>
  );
};

export default SignUp;
