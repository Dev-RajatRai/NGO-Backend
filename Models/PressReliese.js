import mongoose from "mongoose";
const pressSchema = new mongoose.Schema({
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
  headline: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    type: String,
    required: true,
  },
});

const pressReliese = mongoose.model("pressReliese", pressSchema);

export default pressReliese;
