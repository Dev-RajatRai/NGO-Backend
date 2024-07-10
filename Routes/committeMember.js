import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getcommitemember ,addcommitemember} from "../Controllers/Committemember.js"
import fs from "fs";
import multer from "multer";
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routes = express.Router();
const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "committe"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "committe"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// app.post('/api/committee-members', upload.fields([
//   { name: 'photo', maxCount: 1 },
//   { name: 'Adharephoto', maxCount: 5 }
// ]), 

routes.get("/all-committee-members",getcommitemember)

routes.post("/add-committee-members", upload.any([
  { name: 'photo', maxCount: 1 },
  { name: 'Adharephoto', maxCount: 2 }
]),addcommitemember)


export default routes;