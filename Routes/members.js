// routes/userRoutes.js
import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getMembersByLocation,
  getUserById,
  loginUser,
  updateUserById,
} from "../Controllers/Members.js";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import multer from "multer";

const router = express.Router();
const upload = multer();
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

// User registration
router.post("/register-member", async (req, res) => {
  const {
    name,
    email,
    password,
    designation,
    location,
    state,
    city,
    country,
    phone,
    type,
  } = req.body;
  const result = await createUser({
    name,
    email,
    password,
    designation,
    location,
    state,
    city,
    country,
    phone,
    type,
  });
  res.status(result.status).json(result);
});
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
    res
      .status(response.status)
      .send(response.data || { message: response.message });
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
