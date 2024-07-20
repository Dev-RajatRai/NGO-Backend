import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import { fileURLToPath } from "url";
import {
  createAboutData,
  deleteAboutById,
  getAllAboutData,
  searchAboutById,
  updateAboutById,
} from "../Controllers/About.js";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "about"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "about"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All Temples
routes.get("/get-all-about", async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const val = await getAllAboutData(parseInt(page), parseInt(limit));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Add temple API
routes.post(
  "/create-about",
  isLoggedIn,
  isAdmin,
  upload.none(),
  async (req, res) => {
    try {
      const response = await createAboutData(req.body, req.files);
      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error in create About route:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
);

// Delete Temple by ID
routes.delete("/delete-about/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteAboutById(id);
    res.status(response.status).send({ message: response.message });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Update Temple by ID
routes.put(
  "/update-about",
  isLoggedIn,
  isAdmin,
  upload.none(),
  async (req, res) => {
    try {
      const AboutData = req.body;
      const response = await updateAboutById(AboutData);

      res
        .status(response.status)
        .send({ message: response.message, data: response.data });
    } catch (error) {
      console.error("Error updating About:", error);
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);

routes.get("/get-about/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const about = await searchAboutById(id);
    if (!about) {
      return res.status(404).send({ message: "About not found" });
    }
    res.status(200).send(about);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
});

export default routes;
