import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pressReliese from "../Models/PressReliese.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPress = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const data = await pressReliese
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title content  createdAt");

    const totalDocuments = await pressReliese.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / limit);

    return {
      status: 200,
      data,
      page,
      totalPages,
      totalDocuments,
    };
  } catch (error) {
    console.error("Error retrieving press releases:", error);
    throw error;
  }
};

export const createPressWithoutImage = async (pressRelieseData, files) => {
  try {
    const { title, content } = pressRelieseData;

    const requiredFields = { title, content };
    const missingFields = Object.keys(requiredFields).filter(
      (key) => !requiredFields[key]
    );

    if (missingFields.length > 0) {
      return {
        status: 400,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    const newPressReliese = new pressReliese({
      title,
      content,
    });
    const savedPressreliese = await newPressReliese.save();

    return {
      status: 201,
      data: {
        data: savedPressreliese,
        message: "Press release created successfully",
      },
    };
  } catch (error) {
    console.error("Error creating press release:", error);
    return { status: 500, message: "Error creating press release" };
  }
};

export const searchPressRelieseByTitle = async (title) => {
  return await pressReliese.find(
    { title: new RegExp(title, "i") }, // Case-insensitive search
    { _id: 1, title: 1 } // Select only the ID and title fields
  );
};

export const searchPressRelieseById = async (id) => {
  try {
    const data = await pressReliese.findById(id);
    return { status: 200, data };
  } catch (error) {
    console.error("Error searching press release:", error);
    return { status: 500, message: "Error searching press release" };
  }
};

const deleteImage = (imageName) => {
  if (imageName) {
    const imagePath = path.join(
      __dirname,
      "../",
      "public",
      "pressReliese",
      imageName
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });
  }
};

export const deletePressRelieseById = async (id) => {
  try {
    const data = await pressReliese.findByIdAndDelete(id);
    if (!data) {
      return { status: 404, message: "Press release not found" };
    }

    deleteImage(data.image.image);
    return { status: 200, message: "Press release deleted successfully" };
  } catch (error) {
    console.error("Error deleting press release:", error);
    return { status: 500, message: "Error deleting press release" };
  }
};

export const updatePressRelieseById = async (pressRelieseData, files) => {
  try {
    if (!pressRelieseData || !pressRelieseData.id) {
      return { status: 400, message: "Invalid press release data" };
    }

    if (files.find((file) => file.fieldname === "image")) {
      pressRelieseData.image = files.find(
        (file) => file.fieldname === "image"
      ).filename;
    }
    const updateData = { ...pressRelieseData };
    if (!pressRelieseData.image) {
      delete updateData.image;
    }

    const updatedPressReliese = await pressReliese.findByIdAndUpdate(
      pressRelieseData.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPressReliese) {
      return { status: 404, message: "Press release not found" };
    }

    return {
      status: 200,
      data: {
        data: updatedPressReliese,
        message: "Press release updated successfully",
      },
    };
  } catch (error) {
    console.error("Error updating press release:", error);
    return { status: 500, message: "Internal server error" };
  }
};
