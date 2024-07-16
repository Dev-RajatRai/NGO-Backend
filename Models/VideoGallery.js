import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  src: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const videoGallery = mongoose.model("videoGallery", videoSchema);

export default videoGallery;
