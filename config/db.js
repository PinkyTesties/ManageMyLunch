// db.js
// This should not have to be changed


const mongoose = require("mongoose");
const db =
  "mongodb+srv://btj0392:penisisnotagoodpassword@cluster0.31u7ub6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  
/* Replace <password> with your database password */

mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Success! MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    console.log("PROBABLY AN IP ADDRESS ISSUE. ADD YOUR IP ADDRESS IN MONGODB DASHBOARD");

    process.exit(1);
  }
};
module.exports = connectDB;