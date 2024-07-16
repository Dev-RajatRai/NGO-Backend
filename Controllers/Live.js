import path from "path";
import { fileURLToPath } from "url";
import liveUrl from "../Models/Live.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllLive = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const data = await liveUrl
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

export const createLive = async (liveUrlData, files) => {
  try {
    const { title, src } = liveUrlData;

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

    const newLiveUrl = new liveUrl({
      title,
      src,
    });

    const savedLiveUrl = await newLiveUrl.save();

    return {
      status: 201,
      data: {
        data: savedLiveUrl,
        message: "Live listed successfully",
      },
    };
  } catch (error) {
    console.error("Error creating Live:", error);
    return { status: 500, message: "Error creating Live" };
  }
};

export const searchLiveByTitle = async (title) => {
  return await liveUrl.find(
    { title: new RegExp(title, "i") }, // Case-insensitive search
    { _id: 1, title: 1 } // Select only the ID and title fields
  );
};
export const searchLiveById = async (id) => {
  try {
    const data = await liveUrl.find({ _id: id });
    return { status: 200, data: data };
  } catch (error) {
    console.error("Error searching Live:", error);
    return { status: 500, message: "Error searching Live" };
  }
};

export const deleteLiveById = async (id) => {
  try {
    const data = await liveUrl.findById(id);
    if (!data) {
      return { status: 404, message: "Live not found" };
    }

    await liveUrl.findByIdAndDelete(id);
    return { status: 200, message: "Live deleted successfully" };
  } catch (error) {
    console.error("Error deleting Live:", error);
    return { status: 500, message: "Error deleting Live " };
  }
};

export const UpdateLiveById = async (liveUrlData) => {
  try {
    // Validate Press-Reliese  object
    if (!liveUrlData || !liveUrlData.id) {
      return { status: 400, message: "Invalid Live data", data: null };
    }
    const updateLive = await liveUrl.findByIdAndUpdate(
      liveUrlData.id,
      { $set: liveUrlData },
      { new: true }
    );

    if (!updateLive) {
      return { status: 404, message: "Live not found", data: null };
    }

    return {
      status: 200,
      data: {
        data: updateLive,
        message: "Live updated successfully",
      },
    };
  } catch (error) {
    console.error("Error updating Live:", error);
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
