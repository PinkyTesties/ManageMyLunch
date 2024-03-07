

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Bootstrap CSS & JS imports
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Components imports
import CreateBook from "./components/CreateBook";
import ShowBookList from "./components/ShowBookList";
import ShowBookDetails from "./components/ShowBookDetails";
import UpdateBookInfo from "./components/UpdateBookInfo";
import LoginPage from "./components/LoginPage"; 
import SignUp from "./components/SignUp"; 
import Dashboard from "./components/Dashboard"; 

//hello

// Routes
const router = createBrowserRouter([
  { path: "/show-book", element: <ShowBookList /> },
  { path: "/", element: <LoginPage /> },
  { path: "/create-book", element: <CreateBook /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/show-book/:id", element: <ShowBookDetails /> },
  { path: "/edit-book/:id", element: <UpdateBookInfo /> },
  { path: "/sign-up", element: <SignUp /> },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);