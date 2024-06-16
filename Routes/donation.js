import express from "express";
import {
  createDonation,
  deleteDonation,
  getAllDonations,
  getDonationById,
  handleDonationPayment,
  updateDonation,
} from "../Controllers/Donation.js";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";

const router = express.Router();

// Create a Donation
router.post("/create-donation", createDonation);

// Get All Donations
router.get("/get-all-donations", isLoggedIn, isAdmin, getAllDonations);

// Get a Single Donation by ID
router.get("/get-donation-by-id/:id", getDonationById);

// Update a Donation
router.put("/update-donations/:id", isLoggedIn, isAdmin, updateDonation);

// Delete a Donation
router.delete("/delete-donations/:id", isLoggedIn, isAdmin, deleteDonation);

// Handle Donation Payment
router.post("/handle-donations/:id/payment", handleDonationPayment);

export default router;
