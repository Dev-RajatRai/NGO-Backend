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
import aboutRoutes from "./Routes/about.js";
import pressrelieseRoutes from "./Routes/pressreliese.js";
import committeRoutes from "./Routes/committeMember.js";
import videogalleryRoutes from "./Routes/videoGallery.js";
import organisationRoutes from "./Routes/organisation.js";
import photogalleryRoutes from "./Routes/photoGallery.js";
import aboutcardRoutes from "./Routes/aboutcard.js";
import liveurlRoutes from "./Routes/live.js";
import socialmediaRoutes from "./Routes/socialmedia.js";
import { connectToMongo } from "./dbConnection.js";
import contentRoutes from "./Routes/testing.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
const app = express();

// Use CORS middleware with dynamic origin determination
app.use(cors());
// __filename and __dirname are not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;

// ... (rest of your middleware and routes)
// address
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1", templesRoutes);
app.use("/api/v1", eventRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", donation);
app.use("/api/v1", comment);
app.use("/api/v1", payment);
app.use("/api/v1", aboutRoutes);
app.use("/api/v1", aboutcardRoutes);
// Routes
app.use("/api/v1", contentRoutes);
app.use("/api/v1", pressrelieseRoutes);
app.use("/api/v1", committeRoutes);
app.use("/api/v1", organisationRoutes);
app.use("/api/v1", socialmediaRoutes);
app.use("/api/v1", videogalleryRoutes);
app.use("/api/v1", liveurlRoutes);
app.use("/api/v1", photogalleryRoutes);
app.use("/api/v1", express.static("public"));
app.use("/api/v1", express.static(path.join(__dirname, "uploads")));
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
