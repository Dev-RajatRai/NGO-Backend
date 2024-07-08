import express from "express";
import {commi}
import path from "path";
import { fileURLToPath } from "url";
const router=express.Router()
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
// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../", "public", "CommitteMember"));
      },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');


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
        cb('Error: Images Only!');
    }
}

router.post("/addcommittemember",upload,addcommitemember);