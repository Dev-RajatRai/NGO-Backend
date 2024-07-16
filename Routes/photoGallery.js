import express from "express";
import multer from "multer";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createPhotoGalleryWithoutImages,
  deletePhotosGalleryById,
  getAllPhotoGallery,
  getMainImage,
  searchPhotoGalleryById,
  searchPhotoGalleryByTitle,
  updatePhotosGalleryById,
  uploadPhotoGalleryImagesById,
} from "../Controllers/PhotoGallery.js";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "photosGallery"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "photosGallery"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All Temples
routes.get("/get-all-photos", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const val = await getAllPhotoGallery(parseInt(page), parseInt(100));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Add temple API
routes.post(
  "/create-photos",
  isLoggedIn,
  isAdmin,
  upload.any({ name: "mainImage", maxCount: 1 }),
  async (req, res) => {
    try {
      const response = await createPhotoGalleryWithoutImages(
        req.body,
        req.files
      );
      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error in create photos route:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
);

// add images
routes.post(
  "/upload-images/:photosGalleryId",
  upload.any([{ name: "mainImage", maxCount: 1 }]),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const { photoGalleryId } = req.params;
    const result = await uploadPhotoGalleryImagesById(
      photoGalleryId,
      req.files
    );
    const message = "Images updated";

    res.status(result.status).send({
      ...result,
      message,
    });
  }
);

routes.post("/create-multiple-photos", async (req, res) => {
  try {
    const photoData = req.body;
    const response = await createMultiplePhotoGallery(photoData);
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

//searchh temple
routes.get("/search-photos", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(400)
        .send({ message: "Title query parameter is required" });
    }
    const response = await searchPhotoGalleryByTitle(title);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete Temple by ID
routes.delete("/delete-photos/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deletePhotosGalleryById(id);
    res.status(response.status).send({ message: response.message });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Update Temple by ID
routes.put(
  "/update-photos",

  upload.any({
    name: "mainImage",
    maxCount: 1,
  }),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const photoData = req.body;
      const GalleryImages = req.files;
      console.log(GalleryImages);
      const response = await updatePhotosGalleryById(photoData, GalleryImages);

      res
        .status(response.status)
        .send({ message: "Photo list updated successfully", data: response.data });
    } catch (error) {
      console.error("Error updating photos:", error);
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);

routes.get("/get-photos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const PhotosGallery = await searchPhotoGalleryById(id);
    if (!PhotosGallery) {
      return res.status(404).send({ message: "Photos not found" });
    }
    res.status(200).send(PhotosGallery);
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
export default routes;
