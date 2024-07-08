import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pressReliese from "../Models/PressReliese.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPress = async (page, limit) => {
  try {
    const data = await pressReliese
      .find({})
      .sort({ createdAt: -1 })
      .select("title  description headline  date image");

    return { status: 200, data };
  } catch (error) {
    console.error("Error retrieving press-reliese:", error);
    throw error;
  }
};
export const createPressWithoutImage = async (pressRelieseData) => {
  try {
    const { title, description, headline, date, image } = pressRelieseData;

    const requiredFields = {
      title,
      description,
      headline,
      date,
      image,
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

    // if (files.find((file) => file.fieldname === "mainImage")) {
    //   imagesData.mainImage = files.find((file) => file.fieldname === "mainImage").filename;
    // }
    // if (files.find((file) => file.fieldname === "bannerImage")) {
    //   imagesData.bannerImage = files.find((file) => file.fieldname === "bannerImage").filename;
    // }
    // if (files.find((file) => file.fieldname === "sub1")) {
    //   imagesData.sub1 = files.find((file) => file.fieldname === "sub1").filename;
    // }
    // if (files.find((file) => file.fieldname === "sub2")) {
    //   imagesData.sub2 = files.find((file) => file.fieldname === "sub2").filename;
    // }
    // if (files.find((file) => file.fieldname === "sub3")) {
    //   imagesData.sub3 = files.find((file) => file.fieldname === "sub3").filename;
    // }

    const newPressReliese = new pressReliese({
      title,
      description,
      headline,
      date,
      image,
    });

    const savedPressreliese = await newPressReliese.save();

    return {
      status: 201,
      data: {
        message: "Press-Reliese listed successfully",
        PressrelieseId: savedPressreliese._id,
        savedPressreliese: savedPressreliese,
      },
    };
  } catch (error) {
    console.error("Error creating press-reliese:", error);
    return { status: 500, message: "Error creating press-reliese" };
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
    const data = await pressReliese.find({ _id: id });
    return { status: 200, data: data };
  } catch (error) {
    console.error("Error searching press-reliese:", error);
    return { status: 500, message: "Error searching press-reliese" };
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
    ); // Adjust the path according to your directory structure
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });
  }
};

export const deletePressRelieseById = async (id) => {
  try {
    const data = await pressReliese.findById(id);
    if (!data) {
      return { status: 404, message: "Press-Reliese not found" };
    }

    // Delete the image files from the server
    deleteImage(data.image.image);
    await pressReliese.findByIdAndDelete(id);
    return { status: 200, message: "Press-Reliese deleted successfully" };
  } catch (error) {
    console.error("Error deleting Press-Reliese:", error);
    return { status: 500, message: "Error deleting Press-Reliese " };
  }
};

export const updatePressRelieseById = async (pressRelieseData) => {
  try {
    console.log(pressRelieseData);
    // Validate Press-Reliese  object
    if (!pressRelieseData || !pressRelieseData.id) {
      return { status: 400, message: "Invalid Press-Reliese data", data: null };
    }
    const updatedPressReliese = await pressReliese.findByIdAndUpdate(
      pressRelieseData.id,
      { $set: pressRelieseData },
      { new: true }
    );

    if (!updatedPressReliese) {
      return { status: 404, message: "Press-Reliese not found", data: null };
    }

    return {
      status: 200,
      message: "Press-Reliese updated successfully",
      data: updatedPressReliese,
    };
  } catch (error) {
    console.error("Error updating Press-Reliese:", error);
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
