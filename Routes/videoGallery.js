import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import { fileURLToPath } from "url";
import {
  createVideoGalleryWithoutImage,
  deleteVideoGalleryById,
  getAllvideoGallery,
  searchVideoGalleryById,
  searchVideoGalleryByTitle,
  updateVideoGalleryById,
} from "../Controllers/VideoGallery.js";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "videoGallery"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "videoGallery"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All Temples
routes.get("/get-all-videogallery", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const val = await getAllvideoGallery(parseInt(page), parseInt(100));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Add temple API
routes.post(
  "/create-videogallery",
  isLoggedIn,
  isAdmin,
  upload.none(),
  async (req, res) => {
    try {
      const response = await createVideoGalleryWithoutImage(
        req.body,
        req.files
      );
      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error in create Video-Gallery route:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
);

// add images

//searchh temple
routes.get("/search-videogallery", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(400)
        .send({ message: "Title query parameter is required" });
    }
    const response = await searchVideoGalleryByTitle(title);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete Temple by ID
routes.delete("/delete-videogallery/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteVideoGalleryById(id);
    res.status(response.status).send({ message: response.message });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Update Temple by ID
routes.put(
  "/update-videogallery",
  isLoggedIn,
  isAdmin,
  upload.none(),
  async (req, res) => {
    try {
      const videoGalleryData = req.body;
      const response = await updateVideoGalleryById(videoGalleryData);

      res
        .status(response.status)
        .send({ message: response.message, data: response.data });
    } catch (error) {
      console.error("Error updating video-gallery:", error);
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);

routes.get("/get-videogallery/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const videogallery = await searchVideoGalleryById(id);
    if (!videogallery) {
      return res.status(404).send({ message: "video-Gallery not found" });
    }
    res.status(200).send(videogallery);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
});

export default routes;
