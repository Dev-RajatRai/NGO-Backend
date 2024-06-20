import express from "express";
import http from "http";
import "dotenv/config";
import "./dbConnection.js";
import templesRoutes from "./Routes/temples.js";
import eventRoutes from "./Routes/events.js";
import userRoutes from "./Routes/members.js";
import donation from "./Routes/donation.js";
import comment from "./Routes/comment.js";
import payment from "./Routes/payment.js";
import { connectToMongo } from "./dbConnection.js";
import cors from "cors";

const app = express();

// Use CORS middleware with dynamic origin determination
app.use(cors());

const port = process.env.PORT || 3001;

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
app.use("/api/v1", comment); //checked
app.use("/api/v1", payment); //checked
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
