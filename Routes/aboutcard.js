import express from "express";
import {
  getaboutCarddata,
  postaboutCarddata,
  getaboutCarddataById,
  deleteaboutCarddataById,
} from "../Controllers/AboutCards.js";
import multer from "multer";
import path from "path";

const router = express.Router();
// Set up storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
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

router.get("/aboutcard", getaboutCarddata);
router.post("/postaboutcard", upload, postaboutCarddata);
router.get("/aboutonedatacard/:id", getaboutCarddataById);
router.delete("/aboutdeletecard/:id", deleteaboutCarddataById);

export default router;
