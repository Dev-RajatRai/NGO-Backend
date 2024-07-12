import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getcommitemember ,addcommitemember,updatecommitemember,getcommiteMemberById,deletecommiteMemberById} from "../Controllers/Committemember.js"
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



routes.get("/all-committee-members",getcommitemember)
routes.get("/single-committee-members/:id",getcommiteMemberById)
routes.post("/add-committee-members", upload.any([
  { name: 'photo', maxCount: 1 },
  { name: 'Adharefront', maxCount: 1 },
  { name: 'Adhareback', maxCount: 1 }
]), async (req, res) => {
  try {
    const response = await addcommitemember(
      req.body,
      req.files
    );
    res.status(response.status).json(response);
  } catch (error) {
    console.error("Error in create photos route:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
})

routes.put("/update-committee-members/:id", upload.any([
  { name: 'photo', maxCount: 1 },
  { name: 'Adharefront', maxCount: 1 },
  { name: 'Adhareback', maxCount: 1 }
]),updatecommitemember)

routes.delete("/delete-committee-members/:id",deletecommiteMemberById)
export default routes;