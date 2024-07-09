import mongoose from "mongoose";
const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  mainImage: {
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

const photoGallery = mongoose.model("photoGallery", photoSchema);

export default photoGallery;
