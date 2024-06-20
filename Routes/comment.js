import express from "express";
import {
  approveComment,
  createComment,
  deleteComment,
  getAllComments,
  getApprovedComments,
  getCommentsByTemple,
  submitComment,
  updateComment,
} from "../Controllers/Comments.js";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
import multer from "multer";

const router = express.Router();
const upload = multer();
router.post("/comments", createComment);
router.get("/temples/:templeId/comments", getCommentsByTemple);
router.put("/comments/:commentId/approve", isLoggedIn, isAdmin, approveComment);
// New route to get all comments
router.get("/get-all-comments", isLoggedIn, isAdmin, getAllComments);
router.post("/submit-comment", submitComment);
router.get("/get-comments/:templeId", getApprovedComments);
// Update comment route
router.put(
  "/update-comment",
  isLoggedIn,
  isAdmin,
  upload.none(),
  updateComment
);
// Delete comment route
router.delete("/delete-comment/:commentId", isLoggedIn, isAdmin, deleteComment);

export default router;
