/*
UserDashboard.jsx

This the header for most pages within in the manage my lunch application
It contains the logo and the navigation buttons

It also contains a modal that displays the account menu when the account button is clicked

Created by Vidhusan

*/

//React imports
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//logo
import logo from "./componentAssets/logov1.png";
//Styles
import "../style/UserDashboard.css";
//URL imports
import { targetURL } from './../urls';
//Modal
Modal.setAppElement("#root");

const UserDashboard = ({ history }) => {
  //Variables
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [userID, setUserID] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    university: "",
    userID: "",

  });

  const navigate = useNavigate();

  //Function to toggle the account menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };



  //Fetch the user details from the session
  useEffect(() => {
    axios
      .get(`${targetURL}/`)
      .then((res) => {
        if (res.data.valid) {
          setUserDetails({
            name: res.data.name,
            email: res.data.email,
            university: res.data.university,
            userID: res.data._id,

          });
        } else {
          //Redirect to the login page if the user is not logged in
          //navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (userDetails && userDetails.email) {
      const fetchUserAdminStatus = async () => {
        const email = userDetails.email;
        const response = await fetch(`${targetURL}/api/users/email/${email}`);
        const data = await response.json();

        console.log(data);  // for debugging purposes

        setIsAdmin(data.isAdmin);
      };

      fetchUserAdminStatus();
    }
  }, [userDetails]);

  //Return the header
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <img src={logo} alt="Logo" height={100} />
        <h1 className="title">Manage My Lunch</h1>
        <div className="menu-buttons">
          <button onClick={toggleDropdown} className="account-button">
            Account
          </button>
          <Link to="/dashboard">
            <button className="cart-button">Dashboard</button>
          </Link>
          {/**Only admin has access to Reports Page */}
          {isAdmin && (
            <Link to="/Reports">
              <button className="reports-button">Reports</button>
            </Link>
          )}
          <Link to="/CompleteOrder">
            <button className="order-button">Pick Up Order</button>
          </Link>
          <Link to="/Cart">
            <button className="cart-button">Cart</button>
          </Link>
        </div>
      </header>

      {/* Account Modal 
        Modal styling must be done inline for some reason
      */}
      <Modal
        isOpen={showDropdown}
        onRequestClose={toggleDropdown}
        contentLabel="Account Menu"
        style={{
          content: {
            width: "500px",
            height: "600px",
            right: "0px",
            left: "auto",
          },
        }}
      >
        {/* Contents of the Account Menu
        Prettier code formatting makes this look weird
        */}
        <h1>Account Menu</h1>
        <h4>Logged in as: {userDetails.name}</h4>
        <p style={{ fontSize: "9pt" }}>{userDetails.university}</p>
        <br></br>

        <a
          href="dashboard"
          style={{
            display: "block",
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#f2eded",
            textDecoration: "none",
            color: "black",
            textAlign: "center",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4d4d4")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#f2eded")
          }
        >
          Dashboard
        </a>
        {/**Admin will access SettingsPage, Normal user see SettingsPage_User.
         *  SettingsPage has same functions SettingsPage user, as well as additional admin settings */}
        <a
          href={isAdmin ? "/SettingsPage" : "/SettingsPage_User"}
          style={{
            display: "block",
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#f2eded",
            textDecoration: "none",
            color: "black",
            textAlign: "center",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4d4d4")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#f2eded")
          }
        >
          Settings
        </a>
        <a
          href="/CompleteOrder"
          style={{
            display: "block",
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#f2eded",
            textDecoration: "none",
            color: "black",
            textAlign: "center",
            borderRadius: "5px",
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d4d4d4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f2eded'}
        >
          Pickup Order
        </a>
        <a
          href="/Cart"
          style={{
            display: "block",
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#f2eded",
            textDecoration: "none",
            color: "black",
            textAlign: "center",
            borderRadius: "5px",
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d4d4d4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f2eded'}
        >
          Cart
        </a>
        <a
          href="/OrderStatus"
          style={{
            display: "block",
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#f2eded",
            textDecoration: "none",
            color: "black",
            textAlign: "center",
            borderRadius: "5px",
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d4d4d4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f2eded'}
        >
          Orders
        </a>
        <br></br>
        <br></br>
        <a
          href="/"
          style={{
            display: "block",
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#f2eded",
            textDecoration: "none",
            color: "black",
            textAlign: "center",
            borderRadius: "5px",
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d4d4d4'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f2eded'}
        >
          Logout
        </a>
        <br></br>
      </Modal>
      <hr />
    </div>
  );
};

export default UserDashboard;
