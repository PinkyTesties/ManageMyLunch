// db.js
// This should not have to be changed. This is the connection to the MongoDB database.

// Created By Tyler Costa

const mongoose = require("mongoose");
const db =
  
  //This is the connection string to the MongoDB database, it contains the username and password for the database
 "mongodb+srv://btj0392:yNgwDBoS5mouG4wC@cluster0.31u7ub6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Success! MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    console.log("Failed to connect to MongoDB");

    process.exit(1);
  }
};
module.exports = connectDB;