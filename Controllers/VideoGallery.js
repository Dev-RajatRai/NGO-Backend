import path from "path";
import { fileURLToPath } from "url";
import videoGallery from "../Models/VideoGallery.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllvideoGallery = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const data = await videoGallery
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("  title  src  ");

    return { status: 200, data };
  } catch (error) {
    console.error("Error retrieving Video-Gallery:", error);
    throw error;
  }
};

export const createVideoGalleryWithoutImage = async (
  videoGalleryData,
  files
) => {
  try {
    const { title, src } = videoGalleryData;

    const requiredFields = {
      title,
      src,
    };

    const missingFields = Object.keys(requiredFields).filter(
      (key) => !requiredFields[key]
    );

    if (missingFields.length > 0) {
      return {
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    const newVideoGallery = new videoGallery({
      title,
      src,
    });

    const savedVideoGallery = await newVideoGallery.save();

    return {
      status: 201,
      message: "Video-Gallery listed successfully",
      data: {
        data: savedVideoGallery,
        message: "Video-Gallery listed successfully",
      },
      
    };
  } catch (error) {
    console.error("Error creating Video-Gallery:", error);
    return { status: 500, message: "Error creating Video-Gallery" };
  }
};

export const searchVideoGalleryByTitle = async (title) => {
  return await videoGallery.find(
    { title: new RegExp(title, "i") }, // Case-insensitive search
    { _id: 1, title: 1 } // Select only the ID and title fields
  );
};
export const searchVideoGalleryById = async (id) => {
  try {
    const data = await videoGallery.findOne({ _id: id });
    return { status: 200, data: data };
  } catch (error) {
    console.error("Error searching Video-Gallery:", error);
    return { status: 500, message: "Error searching Video-Gallery" };
  }
};

export const deleteVideoGalleryById = async (id) => {
  try {
    const data = await videoGallery.findById(id);
    if (!data) {
      return { status: 404, message: "Video-Gallery not found" };
    }

    await videoGallery.findByIdAndDelete(id);
    return { status: 200, message: "Video-Gallery deleted successfully" };
  } catch (error) {
    console.error("Error deleting Video-Gallery:", error);
    return { status: 500, message: "Error deleting Video-Gallery " };
  }
};

export const updateVideoGalleryById = async (videoGalleryData) => {
  try {
    // Validate Press-Reliese  object
    if (!videoGalleryData || !videoGalleryData.id) {
      return { status: 400, message: "Invalid Video-Gallery data", data: null };
    }
    const updateVideoGallery = await videoGallery.findByIdAndUpdate(
      videoGalleryData.id,
      { $set: videoGalleryData },
      { new: true }
    );

    if (!updateVideoGallery) {
      return { status: 404, message: "Video-Gallery not found", data: null };
    }

    return {
      status: 200,

      data: {
        data: updateVideoGallery,
        message: "Video-Gallery updated successfully",
      },
    };
  } catch (error) {
    console.error("Error updating Video-Gallery:", error);
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
