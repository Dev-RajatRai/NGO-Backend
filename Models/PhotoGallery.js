import mongoose from "mongoose";
const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  mainImage: {
    type: String,
  },
  date: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const photoGallery = mongoose.model("photoGallery", photoSchema);

export default photoGallery;
