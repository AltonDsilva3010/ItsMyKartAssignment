const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = async () => {
  dotenv.config();
  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.log(error.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
