// db.js
// This should not have to be changed


const mongoose = require("mongoose");
const db =
  "mongodb://127.0.0.1:27017";
  
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