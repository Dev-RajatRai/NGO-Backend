import Donation from "../Models/Donation.js";

export const createDonation = async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();

    if (!donations || donations.length === 0) {
      return res.status(404).json({ message: "No donations found" });
    }

    res.status(200).json({ status: 200, data: donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });
    res.json({ message: "Donation deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleDonationPayment = async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;

    // Validate payment method
    if (
      !paymentMethod ||
      !["UPI", "netbanking", "QR"].includes(paymentMethod)
    ) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Find the donation by ID
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Simulate payment processing based on the method
    let paymentSuccess = false;
    switch (paymentMethod) {
      case "UPI":
        // Simulate UPI payment processing
        if (paymentDetails && paymentDetails.upiId) {
          paymentSuccess = true; // Assume UPI payment is successful
        } else {
          return res
            .status(400)
            .json({ message: "UPI payment details are required" });
        }
        break;

      case "netbanking":
        // Simulate net banking payment processing
        if (paymentDetails && paymentDetails.bankAccount) {
          paymentSuccess = true; // Assume net banking payment is successful
        } else {
          return res
            .status(400)
            .json({ message: "Net banking payment details are required" });
        }
        break;

      case "QR":
        // Simulate QR code payment processing
        if (paymentDetails && paymentDetails.qrCode) {
          paymentSuccess = true; // Assume QR code payment is successful
        } else {
          return res
            .status(400)
            .json({ message: "QR code payment details are required" });
        }
        break;

      default:
        return res.status(400).json({ message: "Unsupported payment method" });
    }

    // Update donation status if payment is successful
    if (paymentSuccess) {
      donation.status = "completed";
      await donation.save();
      res.json(donation);
    } else {
      res.status(500).json({ message: "Payment processing failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
