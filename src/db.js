const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://saisunilkasbe_db_user:BjIoPx5ezSRs4eMa@trim-cluster.f1a8mju.mongodb.net/trim?retryWrites=true&w=majority&appName=trim-cluster"
    );

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;