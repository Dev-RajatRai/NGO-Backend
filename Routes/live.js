import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import { fileURLToPath } from "url";
import {
  UpdateLiveById,
  createLive,
  deleteLiveById,
  getAllLive,
  searchLiveById,
  searchLiveByTitle,
} from "../Controllers/Live.js";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "live"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "live"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All Temples
routes.get("/get-all-live", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const val = await getAllLive(parseInt(page), parseInt(100));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
routes.post(
  "/create-live",
  isLoggedIn,
  isAdmin,
  upload.none(),
  async (req, res) => {
    try {
      const response = await createLive(req.body);
      res.status(response.status).json({response});
    } catch (error) {
      console.error("Error in create Live route:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
);

// add images

//searchh temple
routes.get("/search-live", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(400)
        .send({ message: "Title query parameter is required" });
    }
    const response = await searchLiveByTitle(title);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete Temple by ID
routes.delete("/delete-live/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteLiveById(id);
    res.status(response.status).send({ message: response.message });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Update Temple by ID
routes.put(
  "/update-live",
  isLoggedIn,
  isAdmin,
  upload.none(),
  async (req, res) => {
    try {
      const liveUrlData = req.body;
      const response = await UpdateLiveById(liveUrlData);

      res
        .status(response.status)
        .send({ message: response.message, data: response.data });
    } catch (error) {
      console.error("Error updating Live:", error);
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);

routes.get("/get-live/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const liveurl = await searchLiveById(id);
    if (!liveurl) {
      return res.status(404).send({ message: "Live not found" });
    }
    res.status(200).send(liveurl);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
});

export default routes;
