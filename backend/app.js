// app.js
const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session"); 
const MongoStore = require('connect-mongo');
const cookieParser = require ('cookie-parser');
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URI;

const app = express();

// Use the cors middleware with the origin and credentials options
app.use(cors({
  origin: ["http://localhost:5173"], // Replace with your frontend's domain
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

// Use the body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(cookieParser());

const store = MongoStore.create({ mongoUrl });

// Use the session middleware
app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: true,
  store: store, // Use the store created
  cookie: { secure: true, sameSite: 'lax' }
}));

app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false });
  }
});

// Connect Database
connectDB();

// Import routes
const authRoute = require("./routes/api/AuthRoute");
const userRoutes = require("./routes/api/users");
const loginRoutes = require("./routes/api/login");
const DriverLoginRoutes = require("./routes/api/driverslogin");
const restaurantRoutes = require("./routes/api/restaurants");
const menuItemRoutes = require("./routes/api/menuItems");
const cartRoutes = require("./routes/api/cart");  
const completedCartRoutes = require('./routes/api/CompletedCarts');
const restaurantreviews = require('./routes/api/reviewForm');
const addDriver = require('./routes/api/drivers');
const code = require('./routes/api/code');
const driverReviews = require('./routes/api/DriverReviewForm');

// Use the routes
app.use("/", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menuItems", menuItemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/CompletedCarts', completedCartRoutes);
app.use('/api/reviewForm', restaurantreviews);
app.use('/api/drivers', addDriver);
app.use('/api/driverslogin', DriverLoginRoutes);
app.use('/api/code', code);
app.use('/api/DriverReviewForm', driverReviews);

// Serve static files from the "restaurant_assets" and "menuItem_assets" directories
app.use('/restaurant_assets', express.static('restaurant_assets'));
app.use('/menuItem_assets', express.static('menuItem_assets'));

app.listen(port, () => console.log(`Server running on port ${port}`));