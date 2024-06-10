// db.js
// This should not have to be changed unless you are changing the database connection.
// This is the connection to the MongoDB database created in the log rocket tutorial.
// - Tyler Costa 19075541

const mongoose = require("mongoose");
const db =
"mongodb+srv://btj0392:yNgwDBoS5mouG4wC@cluster0.31u7ub6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


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