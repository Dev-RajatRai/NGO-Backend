// routes/userRoutes.js
import express from "express";
import {
  createUser,
  deleteUserById,
  getAllAdmin,
  getAllUsers,
  getAllUsersName,
  getMembersByLocation,
  getUserById,
  loginUser,
  updateUserById,
} from "../Controllers/Members.js";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const router = express.Router();
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "members"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "members"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// User login
router.post("/login", upload.none(), async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  res.status(result.status).json(result);
});
// Get all users
router.get("/get-all-users", isLoggedIn, isAdmin, async (req, res) => {
  const response = await getAllUsers();
  res.status(response.status).send(response || { message: response.message });
});
router.get("/get-all-admin", isLoggedIn, isAdmin, async (req, res) => {
  const response = await getAllAdmin();
  res.status(response.status).send(response || { message: response.message });
});
router.get("/get-all-users-name", isLoggedIn, isAdmin, async (req, res) => {
  const response = await getAllUsersName();
  res.status(response.status).send(response || { message: response.message });
});

// User registration
router.post(
  "/register-member",
  upload.any({ name: "photo", maxCount: 1 }),
  createUser
);
// Route to get members by location
router.get("/members-by-location", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).send({ message: "Location is required" });
    }

    const members = await getMembersByLocation(location);
    res.status(200).send(members);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving members", error });
  }
});

// Get a user by ID
router.get("/user-by-id/:id", async (req, res) => {
  const { id } = req.params;
  const response = await getUserById(id);
  res
    .status(response.status)
    .send(response.data || { message: response.message });
});
// Get a user by ID
router.get("/get-admin-by-id/:id", async (req, res) => {
  const { id } = req.params;
  const response = await getUserById(id);
  res.status(response.status).send(response || { message: response.message });
});

// Update a user by ID
router.put(
  "/update-user",
  upload.none(),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    const userData = req.body;
    const response = await updateUserById(userData);
    res.status(response.status).send({
      status: response.status,
      message: response.message,
      data: response.data,
    });
  }
);

// Delete a user by ID
router.delete("/delete-user/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;
  const response = await deleteUserById(id);
  res.status(response.status).send({ message: response.message });
});
// checkAuth
router.get("/admin-auth", isLoggedIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
export default router;
