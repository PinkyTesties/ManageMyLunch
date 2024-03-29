

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Bootstrap CSS & JS imports
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Components imports
//Basically every frontend page we create, needs to be put here and in the router function
import CreateRestaurant from "./components/CreateRestaurant";

import LoginPage from "./components/LoginPage"; 
import SignUp from "./components/SignUp"; 
import Dashboard from "./components/Dashboard"; 
import UpdatePassword from "./components/UpdatePassword"; 
import SettingsPage from "./components/SettingsPage"; 
import DeleteAccount_User from "./components/DeleteAccount_User"; 
import DeleteRestaurants from "./components/DeleteRestaurants"; 
import ShowRestaurantDetails from "./components/ShowRestaurantDetails"; 
import UpdateRestaurant from "./components/UpdateRestaurant"; 
import CreateMenuItem from "./components/CreateMenuItem"; 
import DeleteMenuItem from "./components/DeleteMenuItem"; 
import MenuItemViewer from "./components/MenuItemViewer";
import MenuItemEditor from "./components/MenuItemEditor";
import Cart from "./components/Cart";
import OrderStatus from "./components/OrderStatus";



//hello

// Routes
const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/create-restaurant", element: <CreateRestaurant /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/UpdatePassword", element: <UpdatePassword /> },
  { path: "/SettingsPage", element: <SettingsPage /> },
  { path: "/DeleteAccount_User", element: <DeleteAccount_User /> },
  { path: "/delete-restaurant", element: <DeleteRestaurants /> },
  { path: "/ShowRestaurantDetails/:id", element: <ShowRestaurantDetails /> },
  { path: "/UpdateRestaurant/:id", element: <UpdateRestaurant /> },
  { path: "/CreateMenuItem/:id", element: <CreateMenuItem /> },
  { path: "/DeleteMenuItem/", element: <DeleteMenuItem /> },
  { path: "/MenuItemViewer/:id", element: <MenuItemViewer /> },
  { path: "/MenuItemEditor/:id", element: <MenuItemEditor /> },
  { path: "/Cart/", element: <Cart /> },
  { path: "/OrderStatus/", element: <OrderStatus /> },


  

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);