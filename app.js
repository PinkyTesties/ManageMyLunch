const express = require("express");
const connectDB = require("./config/db");

const bookRoutes = require("./routes/api/books");
const userRoutes = require("./routes/api/users");

const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

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

// for the /api/books path
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);


// Connect Database
connectDB();

app.get("/", (req, res) => res.send("Yo my guy this is the wrong tab, this is the backend host"));
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));