import express from "express";
import {
  getaboutdata,
  postaboutdata,
  getaboutdataById,
  deleteaboutdataById,
  updateAboutById,
} from "../Controllers/About.js";

const router = express.Router();
import multer from "multer";
import path from "path";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";

// Set up storage engine
const uploads = multer();
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

// Check file type
function checkFileType(file, cb) {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|gif/;
  // Check file extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
router.get("/about", getaboutdata);
router.post("/postabout", upload, postaboutdata);
router.get("/aboutonedata/:id", getaboutdataById);
router.delete("/aboutdelete/:id", deleteaboutdataById);

router.put("/update-about/:id", isLoggedIn, isAdmin, updateAboutById);
export default router;
