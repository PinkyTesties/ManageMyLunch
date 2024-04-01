//app.js
const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session"); 
const cookieParser = require ('cookie-parser');
const cors = require("cors");
const app = express();
require("dotenv").config();
const authRoutes = require("./routes/api/auth");
const { MONGO_URI, PORT } = process.env;
const bodyParser = require("body-parser");
const userRoutes = require("./routes/api/users");
const loginRoutes = require("./routes/api/login");
const restaurantRoutes = require("./routes/api/restaurants");
const menuItemRoutes = require("./routes/api/menuItems");
const cartRoutes = require("./routes/api/cart");  
const completedCartRoutes = require('./routes/api/CompletedCarts');


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
app.use("/", authRoutes);

app.use(session({
      secret: "secret", // Set a secret for session management
      resave: false,
      saveUninitialized: false, 
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 1 week
      }
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

app.get('/', (req, res) => {
  if(req.session.name) {
    return res.json({valid:true, name: req.session.name, email: req.session.email, university: req.session.university, _id: req.session.id});
  } else {
    return res.json({valid:false});
    }
});

// Connect Database
connectDB();



app.get("/", (req, res) => res.send("Yo my guy this is the wrong tab, this is the backend host"));
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));