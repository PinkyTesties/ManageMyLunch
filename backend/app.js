//app.js
const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session"); 
const MongoStore = require('connect-mongo');

const cookieParser = require ('cookie-parser');
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoute = require("./routes/api/AuthRoute");
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URI;

// const MongoDBStore = require('connect-mongodb-session')(session);

// const store = new MongoDBStore({
//   uri: 'mongodb://localhost:27017/session-store',
//   collection: 'sessions'
// });


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
const cors = require("cors");

const app = express();

app.use(cors(
  {
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  }
));
app.use(express.json());  
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", authRoute);

app.use(session({
  secret: 'your secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if you're using https
}));
// use the cors middleware with the
// origin and credentials options
//app.use(cors({ origin: true, credentials: true }));

// use the body-parser middleware to parse JSON and URL-encoded data
//app.use(bodyParser.urlencoded({ extended: true }));

// use the routes module as a middleware

/*
 BE SURE TO ADD EVERY API ROUTE HERE AND AT TOP OF FILE! 
I SPENT HOURS TRYING TO SOLVE THIS ISSUE AND IT WAS JUST TWO LINES OF CODE
GJKHLDSFLGJKHDFSGHJKLSFDGHJKLFSDHJGKSFDHGJKVSFDGHKJDSFHJGKFGKJHSFDGKJHSDF  
*/

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

// Serve static files from the "restaurant_assets" directory
app.use('/restaurant_assets', express.static('restaurant_assets'));
app.use('/menuItem_assets', express.static('menuItem_assets'));


app.get('/', (req, res) => {
  console.log('Session data:', req.session);

  if(req.session.name) {
    return res.json({valid:true, name: req.session.name, email: req.session.email, university: req.session.university, _id: req.session.userId});
  } else {
    return res.json({valid:false});
  }
});

// Connect Database
connectDB();



app.get("/", (req, res) => res.send("Yo my guy this is the wrong tab, this is the backend host"));
//const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}, ass2`));