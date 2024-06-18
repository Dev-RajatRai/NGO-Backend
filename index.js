import express from "express";
import http from "http";
import "dotenv/config";
import "./dbConnection.js";
import templesRoutes from "./Routes/temples.js";
import eventRoutes from "./Routes/events.js";
import userRoutes from "./Routes/members.js";
import donation from "./Routes/donation.js";
import { connectToMongo } from "./dbConnection.js";
import cors from "cors";

const app = express();

// Define a function to determine the allowed origin dynamically
const AllowedOrigin = (origin, callback) => {
  // Check if the origin is one of the allowed origins
  const allowedOrigins = [
    // "https://admin.nextworktechnologies.com",
    "https://cloud.nextworktechnologies.com",
    "https://nextworktechnologies.com",
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://192.168.0.243:3003",
    "http://192.168.0.193:3000",
    "http://192.168.0.193:3001",
    "http://192.168.0.150:3000",
    "http://192.168.1.7:3000",
  ];
  const isAllowed = allowedOrigins.includes(origin);

  // Call the callback with the result (error, isAllowed)
  callback(null, isAllowed ? origin : null);
};

// Use CORS middleware with dynamic origin determination
app.use(
  cors({
    // origin: AllowedOrigin,
    // methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    // credentials: true,
  })
);

const port = process.env.PORT || 8080;

// ... (rest of your middleware and routes)
// address
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1", templesRoutes); //checked
app.use("/api/v1", eventRoutes); //checked
app.use("/api/v1", userRoutes); //checked
app.use("/api/v1", donation); //checked
app.use("/api/v1", express.static("public"));
const server = http.createServer(app);
// Set a timeout of 5 minutes (300000 milliseconds)
server.setTimeout(600000);

(async () => {
  try {
    await server.listen(port); // Start the server
    await connectToMongo();
    console.log(`Server is running. (${port})`);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();
