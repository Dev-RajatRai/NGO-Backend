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
  date: {
    type: String,
    required: true,
    trim: true,
  },
});

const videoGallery = mongoose.model("videoGallery", videoSchema);

export default videoGallery;
