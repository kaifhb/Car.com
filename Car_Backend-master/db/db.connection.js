const mongoose = require("mongoose");

async function dbConnection() {
  try {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);
    console.log("database connected...");
  } catch (err) {
    console.log("db connection failed", err);
  }
}

exports.dbConnection = dbConnection;
