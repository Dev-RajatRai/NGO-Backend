import mongoose from "mongoose";
const committeMemberSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
      photo: {
        image: String,
      },
     
    },
    {
      timestamps: true,
    }
  );

  const committeMember =mongoose.model('committeMember',committeMemberSchema)

  
export default committeMember;