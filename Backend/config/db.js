const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env["\uFEFFMONGO_URI"];

  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
