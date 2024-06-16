import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env.MONGO_DB_URL;

export const connectToMongo = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB with Mongoose");
    return "successful";
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err; // Rethrow the error to handle it in the caller function
  }
};

export async function closeMongoConnection() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    throw err; // Rethrow the error to handle it in the caller function
  }
}
