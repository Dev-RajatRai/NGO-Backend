import mongoose from "mongoose";
const pressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
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
  content: {
    type: String,
    required: true,
  },
  date: {
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
