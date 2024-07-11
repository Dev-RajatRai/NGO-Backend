import mongoose from "mongoose";
const liveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  src: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const liveUrl = mongoose.model("liveUrl", liveSchema);

export default liveUrl;
