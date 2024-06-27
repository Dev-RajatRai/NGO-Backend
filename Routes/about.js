import express from "express";
import { getaboutdata,postaboutdata,getaboutdataById,deleteaboutdataById} from "../Controllers/About.js";

const router = express.Router();

router.get("/about", getaboutdata);
router.post("/postabout", postaboutdata);
router.get("/aboutonedata/:id", getaboutdataById);
router.delete("/aboutdelete/:id", deleteaboutdataById);

export default router;