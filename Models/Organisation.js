import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },

    mainImage: {
      image: String,
    },

    subImages: [
      {
        image: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Organisation = mongoose.model("Organisation", organisationSchema);

export default Organisation;
