import mongoose from "mongoose";
const committeMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fathername: {
      type: String,
      required: true,
    },
    mothername: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    adhare: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,

      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    photo: {
      image: String,
    },
    Adharefront: {
      image: String,
    },
    Adhareback: {
      image: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const committeMember = mongoose.model("committeMember", committeMemberSchema);

export default committeMember;
