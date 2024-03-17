//app.js
const express = require("express");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const session = require("express-session"); // Import express-session
const MongoDBSession = require('connect-mongodb-session')(session);

const mongoURI = "mongodb+srv://btj0392:penisisnotagoodpassword@cluster0.31u7ub6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const userModel = require("./models/Users");

const bookRoutes = require("./routes/api/books");
const userRoutes = require("./routes/api/users");
const loginRoutes = require("./routes/api/login");

const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");

const app = express();

const store = new MongoDBSession({
  uri: mongoURI,
  collection: 'mySessions',
});

// Set up express-session middleware
app.use(session({
      secret: "12345", // Set a secret for session management
      resave: false,
      //cookie: {maxAge: 30000 },
      saveUninitialized: false,
      store: store,
    })
  );

// use the cors middleware with the
// origin and credentials options
app.use(cors({ origin: true, credentials: true }));

// use the body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use the routes module as a middleware

/*
 BE SURE TO ADD EVERY API ROUTE HERE AND AT TOP OF FILE! 
I SPENT HOURS TRYING TO SOLVE THIS ISSUE AND IT WAS JUST TWO LINES OF CODE
GJKHLDSFLGJKHDFSGHJKLSFDGHJKLFSDHJGKSFDHGJKVSFDGHKJDSFHJGKFGKJHSFDGKJHSDF  
*/

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);

// Connect Database
connectDB();

app.post("/LoginPage", async(req, res) => {
  const {email, password} = req.body;

  const user = await userModel.findOne({email});

  if(user){
    return res.redirect("/LoginPage");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
    return res.redirect("/LoginPage");
  }

  res.redirect("/Dashboard");

});

app.post("/SignUp", async(req, res) => {
  const {name, email, password, date_added, university, updated_date} = req.body;

  let user = await userModel.findOne({email});

  if(user){
    return res.redirect('/SignUp');
  }

  const hashedPsw = await bcrypt.hash(password, 12);

  user = new userModel({
    name, 
    email, 
    password: hashedPsw, 
    date_added, 
    university, 
    updated_date
  })

  await user.save();

  res.redirect("/LoginPage");

});

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("Session test");
});

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));