import express from "express";
import multer from "multer";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createOrganisation,
  deleteOrganisationById,
  getAllOrganisation,
  searchOrganisationById,
  updateOrganisationById,
  uploadOrganisationById,
} from "../Controllers/Organisation.js";

const routes = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "organisations"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "organisations"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

routes.get("/get-all-organisations", async (req, res) => {
  try {
    const { page = 0, limit = 10 } = req.query;
    const val = await getAllOrganisation(parseInt(page), parseInt(limit));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});

routes.post(
  "/create-organisation",
  isLoggedIn,
  isAdmin,
  upload.any([{ name: "mainImage", maxCount: 1 }, { name: "subImages" }]),
  async (req, res) => {
    try {
      const response = await createOrganisation(req.body, req.files);
      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error in create Organisation route:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }
);

// add images
routes.post(
  "/upload-images/:organisationId",
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
    const { organisationId } = req.params;
    const result = await uploadOrganisationById(organisationId, req.files);
    const message = "Images updated";

    res.status(result.status).send({
      ...result,
      message,
    });
  }
);
routes.delete(
  "/delete-organisation/:id",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const response = await deleteOrganisationById(id);
      res.status(response.status).send({ message: response.message });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);

routes.put(
  "/update-organisation",
  upload.any([{ name: "mainImage", maxCount: 1 }, { name: "subImages" }]),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const organisationData = req.body;
      const organisationImages = req.files;
      const response = await updateOrganisationById(
        organisationData,
        organisationImages
      );

      res
        .status(response.status)
        .send({ message: response.message, data: response.data });
    } catch (error) {
      console.error("Error updating organisation:", error);
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);

routes.get("/get-organisation/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const organisation = await searchOrganisationById(id);
    if (!organisation) {
      return res.status(404).send({ message: "organisation not found" });
    }
    res.status(200).send(organisation);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
});
export default routes;
