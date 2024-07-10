import express from "express";
import uploadFile from "../Controllers/Uploader.js";
import { getAllContent, saveContent } from "../Controllers/COntent.js";

const router = express.Router();

router.post("/save", saveContent);
router.post("/upload", uploadFile);
router.get("/all", getAllContent);
export default router;
