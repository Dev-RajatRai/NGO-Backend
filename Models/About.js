import mongoose from "mongoose";
const aboutSchema = new mongoose.Schema({
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
  visiondescription: {
    type: String,
    required: true,
  },
  missiondescription: {
    type: String,
    required: true,
  },
  aboutImage: {
    image: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const About = mongoose.model("about", aboutSchema);

export default About;
