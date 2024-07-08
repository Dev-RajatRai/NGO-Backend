import express from "express";
import multer from "multer";

import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createPressWithoutImage,
  deletePressRelieseById,
  getAllPress,
  searchPressRelieseById,
  searchPressRelieseByTitle,
  updatePressRelieseById,
} from "../Controllers/pressReliese.js";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "pressrelease"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "pressrelease"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All Temples
routes.get("/get-all-pressreliese", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const val = await getAllPress(parseInt(page), parseInt(100));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Add temple API
routes.post("/create-pressrelease", async (req, res) => {
  try {
    const response = await createPressWithoutImage(req.body);
    res.status(response.status).json(response);
  } catch (error) {
    console.error("Error in create press-reliese route:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

// add images

//searchh temple
routes.get("/search-pressreliese", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(400)
        .send({ message: "Title query parameter is required" });
    }
    const response = await searchPressRelieseByTitle(title);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete Temple by ID
routes.delete("/delete-pressreliese/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deletePressRelieseById(id);
    res.status(response.status).send({ message: response.message });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Update Temple by ID
routes.put("/update-pressreliese", async (req, res) => {
  try {
    const pressRelieseData = req.body;
    const response = await updatePressRelieseById(pressRelieseData);

    res
      .status(response.status)
      .send({ message: response.message, data: response.data });
  } catch (error) {
    console.error("Error updating press-reliese:", error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

routes.get("/get-pressreliese/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pressReliese = await searchPressRelieseById(id);
    if (!pressReliese) {
      return res.status(404).send({ message: "Press-Reliese not found" });
    }
    res.status(200).send(pressReliese);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
});

export default routes;
