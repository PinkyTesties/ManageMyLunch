// db.js
// This should not have to be changed


const mongoose = require("mongoose");

require('dotenv').config();
const db = process.env.MONGO_URI; /* Replace <username> with your database username */

mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Success! MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    console.log("Tyler says: Either an IP issue or old db.js file.");
    console.log("Add your ip address in MongoDB, or check discord chat for latest db.js file");

    process.exit(1);
  }
};
module.exports = connectDB;