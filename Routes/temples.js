import express from "express";
import multer from "multer";
import {
  createMultipleTemples,
  deleteTempleById,
  getAllTemples,
  getMainImage,
  getTempSlide,
  searchTempleById,
  searchTemplesByTitle,
  updateTempleById,
} from "../Controllers/Temples.js";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import fs from "fs";
import Temple from "../Models/Temples.js";
import path from "path";
import { fileURLToPath } from "url";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "Public",
    "uploads",
    "temples"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "Public", "uploads", "temples"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All Temples
routes.get("/get-all-temples", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const val = await getAllTemples(parseInt(page), parseInt(limit));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});

// Add temple API
routes.post(
  "/create-temple",
  upload.any([
    { name: "mainImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "sub1", maxCount: 1 },
    { name: "sub2", maxCount: 1 },
    { name: "sub3", maxCount: 1 },
  ]),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const {
        title,
        description,
        shortdescription,
        location,
        establishedDate,
        state,
        country,
        category,
        help,
        city,
      } = req.body;
      const requiredFields = {
        title,
        description,
        shortdescription,
        location,
        establishedDate,
        state,
        city,
        country,
        category,
        help,
        city,
      };
      const missingFields = Object.keys(requiredFields).filter(
        (key) => !requiredFields[key]
      );
      if (missingFields.length > 0) {
        return res.status(400).send({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const newTemple = new Temple({
        title,
        description,
        shortdescription,
        location,
        establishedDate,
        state,
        city,
        country,
        category,
        help,
        mainImage: {
          image: req.files?.[0]?.filename,
        },
        bannerImage: {
          image: req.files?.[0]?.filename,
        },
        sub1: {
          image: req.files?.[0]?.filename,
        },
        sub2: {
          image: req.files?.[0]?.filename,
        },
        sub3: {
          image: req.files?.[0]?.filename,
        },
      });
      await newTemple.save();

      res.status(201).send({
        success: true,
        message: "Temple created successfully",
        data: newTemple,
      });
    } catch (error) {
      console.error("Error creating temple:", error);
      res.status(500).send({
        success: false,
        message: "Error creating temple",
        error: error.message,
      });
    }
  }
);

routes.post("/create-multiple-temples", async (req, res) => {
  try {
    const templesData = req.body;
    const response = await createMultipleTemples(templesData);
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

//searchh temple
routes.get("/search-temples", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(400)
        .send({ message: "Title query parameter is required" });
    }
    const response = await searchTemplesByTitle(title);
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Delete Temple by ID
routes.delete("/delete-temple/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteTempleById(id);
    res.status(response.status).send({ message: response.message });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Update Temple by ID
routes.put(
  "/update-temple",
  upload.none(),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const templeData = req.body;
      const response = await updateTempleById(templeData);
      res
        .status(response.status)
        .send({ message: response.message, data: response.data });
    } catch (error) {
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);
routes.get("/get-temple/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const temple = await searchTempleById(id);
    if (!temple) {
      return res.status(404).send({ message: "Temple not found" });
    }
    res.status(200).send(temple);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
});
// Get photo of the product
routes.get("/get-picture/:id", async (req, res) => {
  const { id } = req.params;
  await getMainImage(id, res);
});
// Get photo of the product
routes.get("/get-temp-slide", getTempSlide);
export default routes;
