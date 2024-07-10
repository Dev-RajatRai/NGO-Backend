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
  facebook: {
    type: String,
    required: true,
    trim: true,
  },
  instagram: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const pressReliese = mongoose.model("pressReliese", pressSchema);

export default pressReliese;
