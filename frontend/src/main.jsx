/*
This is the main file of frontend.
It renders all the components and routes them to the correct page.

Created when the frontend was created, modified by:
Tyler Costa 19075541
Vidhusan 
Ranier 
Xuanhao


*/

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Bootstrap CSS & JS imports
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Components imports
//Basically every frontend component we create, needs to be put here and in the router function
import CreateRestaurant from "./components/CreateRestaurant";
import SignUp from "./components/SignUp_NEW"; 
import Dashboard from "./components/Dashboard"; 
import UpdatePassword from "./components/UpdatePassword"; 
import SettingsPage from "./components/SettingsPage"; 
import DeleteAccount_User from "./components/DeleteAccount_User"; 
import ShowRestaurantDetails from "./components/ShowRestaurantDetails"; 
import UpdateRestaurant from "./components/UpdateRestaurant"; 
import CreateMenuItem from "./components/CreateMenuItem"; 
import MenuItemViewer from "./components/MenuItemViewer";
import MenuItemEditor from "./components/MenuItemEditor";
import Cart from "./components/Cart";
import OrderStatus from "./components/OrderStatus";
import ReviewForm from "./components/ReviewForm";
import ViewRestaurantReviews from "./components/ViewRestaurantReviews";
import EditOrder from "./components/EditOrder";
import AddDriver from "./components/AddDriver";
import Drivers from "./components/Drivers";
import Reports from "./components/Reports";
import DriverLogin from "./components/DriverLogin";
import DriverDashboard from "./components/DriverDashboard";
import CodeReader from "./components/CodeReader";
import CompleteOrder from "./components/CompleteOrder";
import DriverReviewForm from "./components/DriverReviewForm";
import ViewDriverReviews from "./components/ViewDriverReviews";
import EmailTests from "./components/EmailTests";
import MapWithControls from "./components/MapWithControls";
import DeliverOrder from "./components/DeliverOrder";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import LoginPage from "./components/LoginPage"; 

import Rewards from "./components/Rewards";
import SettingsPage_User from "./components/SettingsPage_User";

// Routes
const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/create-restaurant", element: <CreateRestaurant /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/Login", element: <Login /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/UpdatePassword", element: <UpdatePassword /> },
  { path: "/SettingsPage", element: <SettingsPage /> },
  { path: "/DeleteAccount_User", element: <DeleteAccount_User /> },
  { path: "/ShowRestaurantDetails/:id", element: <ShowRestaurantDetails /> },
  { path: "/UpdateRestaurant/:id", element: <UpdateRestaurant /> },
  { path: "/CreateMenuItem/:id", element: <CreateMenuItem /> },
  { path: "/MenuItemViewer/:id", element: <MenuItemViewer /> },
  { path: "/MenuItemEditor/:id", element: <MenuItemEditor /> },
  { path: "/Cart/", element: <Cart /> },
  { path: "/OrderStatus/", element: <OrderStatus /> },
  { path: "/ReviewForm/:id", element: <ReviewForm /> },
  { path: "/ViewRestaurantReviews/:id", element: <ViewRestaurantReviews /> },
  { path: "/EditOrder/:id", element: <EditOrder /> },
  { path: "/AddDriver", element: <AddDriver /> },
  { path: "/Drivers", element: <Drivers />},
  { path: "/Reports", element: <Reports />},
  { path: "/DriverLogin", element: <DriverLogin />},
  { path: "/DriverDashboard", element: <DriverDashboard />},
  { path: "/CodeReader", element: <CodeReader />},
  { path: "/CompleteOrder", element: <CompleteOrder />},
  { path: "/DriverReviewForm/:email", element: <DriverReviewForm />},
  { path: "/ViewDriverReviews/:email", element: <ViewDriverReviews />},
  { path: "/Rewards", element: <Rewards />},
  { path: "/DeliverOrder/:id", element: <DeliverOrder />},
  { path: "/SettingsPage_User", element: <SettingsPage_User />},
  { path: "/oldLogin", element: <LoginPage /> },

  //These are imports for testing pages
  { path: "/EmailTests", element: <EmailTests />},
  { path: "/Map", element: <MapWithControls />},


]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);