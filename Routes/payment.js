import express from "express";
import {
  createDonationOrder,
  validateDonationPayment,
} from "../Controllers/payement.js";

const router = express.Router();
// Route for creating a donation order
router.post("/donate", createDonationOrder);

// Route for validating a donation payment
router.post("/donate/validate", validateDonationPayment);

export default router;
