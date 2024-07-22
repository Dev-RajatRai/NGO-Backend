import express from "express";
import multer from "multer";
import {
  createMultipleTemples,
  createTemple,
  deleteTempleById,
  getAllTemples,
  getFamousTemp,
  getMainImage,
  getTempSlide,
  searchTempleById,
  searchTemplesByTitle,
  updateTempleById,
  uploadTempleImagesById,
} from "../Controllers/Temples.js";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
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
    cb(null, path.join(__dirname, "../", "public", "temples"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All Temples
routes.get("/get-all-temples", async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const val = await getAllTemples(parseInt(page), parseInt(limit));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Add temple API
routes.post(
  "/create-temple",
  isLoggedIn,
  isAdmin,
  upload.any([
    { name: "mainImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "subImages" },
    // { name: "sub2", maxCount: 1 },
    // { name: "sub3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const response = await createTemple(req.body, req.files);
      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error in create temple route:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
);

// add images
routes.post(
  "/upload-images/:templeId",
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
    const { templeId } = req.params;
    const result = await uploadTempleImagesById(templeId, req.files);
    const message = "Images updated";

    res.status(result.status).send({
      ...result,
      message,
    });
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
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete Temple by ID
routes.delete("/delete-temple/:id", isLoggedIn, isAdmin, async (req, res) => {
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
  upload.any([
    { name: "mainImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
    { name: "subImages" },
  ]),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const templeData = req.body;
      const templeImages = req.files;
      console.log(templeImages);
      const response = await updateTempleById(templeData, templeImages);

      res
        .status(response.status)
        .send({ message: response.message, data: response.data });
    } catch (error) {
      console.error("Error updating temple:", error);
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
// get famous temples
routes.get("/get-famous-slide", getFamousTemp);
export default routes;
