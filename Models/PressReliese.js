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
});

const pressReliese = mongoose.model("pressReliese", pressSchema);

export default pressReliese;
