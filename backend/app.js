/*
This is the app.js file

This is the setup for the backend server. It is the entry point for the backend identifying the api routes and the database connection.


When adding routes, declare them at the top of the file and then use them in the app.use() function.
- I spent hours trying to understand why my routes didnt work, and it was because I didnt declare them at the top of the file or ni.

 - Tyler Costa 19075541
*/

// Importing the necessary modules from express, and mongoDB
const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoute = require("./routes/api/AuthRoute");

// Import routes
const userRoutes = require("./routes/api/users");
const loginRoutes = require("./routes/api/login");
const DriverLoginRoutes = require("./routes/api/driverslogin");
const restaurantRoutes = require("./routes/api/restaurants");
const menuItemRoutes = require("./routes/api/menuItems");
const cartRoutes = require("./routes/api/cart");
const completedCartRoutes = require("./routes/api/CompletedCarts");
const restaurantreviews = require("./routes/api/reviewForm");
const addDriver = require("./routes/api/drivers");
//const code = require('./routes/api/code');
const driverReviews = require("./routes/api/DriverReviewForm");
const rewards = require("./routes/api/rewards");
const systemAdminRoutes = require("./routes/api/systemAdmin");
const universities = require("./routes/api/universities");
const routeHandler = require("./routes/api/route");
const locationHandler = require("./routes/api/location");

const cors = require("cors");

const app = express();

// Allows cross origin requests
app.use(
  cors({
    origin: ["http://localhost:5173", "https://managemylunch.onrender.com"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", authRoute);

//Session information
app.use(
  session({
    secret: process.env.SECRET,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/*
 BE SURE TO ADD EVERY API ROUTE HERE AND AT TOP OF FILE! 
I SPENT HOURS TRYING TO SOLVE THIS ISSUE AND IT WAS JUST TWO LINES OF CODE
GJKHLDSFLGJKHDFSGHJKLSFDGHJKLFSDHJGKSFDHGJKVSFDGHKJDSFHJGKFGKJHSFDGKJHSDF  
*/

// Use the api routes declared above
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menuItems", menuItemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/CompletedCarts", completedCartRoutes);
app.use("/api/reviewForm", restaurantreviews);
app.use("/api/drivers", addDriver);
app.use("/api/driverslogin", DriverLoginRoutes);
//app.use('/api/code', code);
app.use("/api/DriverReviewForm", driverReviews);
app.use("/api/rewards", rewards);
app.use("/api/systemAdmin", systemAdminRoutes);
app.use("/api/universities", universities);
app.use("/api/route", routeHandler);
app.use("/api/location", locationHandler);

// This make sures we can access image files from the "restaurant_assets" directory
app.use("/restaurant_assets", express.static("restaurant_assets"));
app.use("/menuItem_assets", express.static("menuItem_assets"));

// This is the session information, containing the user's name, email, university, id, and isAdmin status
app.get("/", (req, res) => {
  if (req.session.name) {
    return res.json({
      valid: true,
      name: req.session.name,
      email: req.session.email,
      university: req.session.university,
      _id: req.session.id,
      isAdmin: req.session.isAdmin,
    });
  } else {
    return res.json({ valid: false });
  }
});

// Connect Database
connectDB();

// This is the text that will be displayed on thepage of localhost:8082 which is the backend and the user should not be able to access this page
app.get("/", (req, res) =>
  res.send("Yo my guy this is the wrong tab, this is the backend host")
);
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));
