import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
// Set up storage engine for multer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "testing"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};
const getServerIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};
// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "testing"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// Handle file upload
const uploadFile = (req, res) => {
  const serverIp = getServerIpAddress();

  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to upload file" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    res.status(200).json({
      url: `http://${serverIp}:3001/api/v1/testing/${req.file.filename}`,
    });
  });
};
export default uploadFile;
