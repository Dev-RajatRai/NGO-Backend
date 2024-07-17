import mongoose from "mongoose";

const templeSchema = new mongoose.Schema(
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
    shortdescription: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    establishedDate: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    mainImage: {
      image: String,
    },
    bannerImage: {
      image: String,
    },
    subImages: [
      {
        image: String
      },
    ],

    // sub1: {
    //   image: String,
    // },
    // sub2: {
    //   image: String,
    // },
    // sub3: {
    //   image: String,
    // },

    help: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Temple = mongoose.model("Temple", templeSchema);

export default Temple;
