import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import photoGallery from "../Models/PhotoGallery.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPhotoGallery = async (page, limit) => {
  try {
    const data = await photoGallery
      .find({})
      .sort({ createdAt: -1 })
      .select("title   mainImage date");

    return { status: 200, data };
  } catch (error) {
    console.error("Error retrieving temples:", error);
    throw error;
  }
};
export const createPhotoGalleryWithoutImages = async (photoData, files) => {
  try {
    const { title, date } = photoData;

    const requiredFields = {
      title,
      date,
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

    const imagesData = {};
    if (files.find((file) => file.fieldname === "mainImage")) {
      imagesData.mainImage = {
        image: files.find((file) => file.fieldname === "mainImage").filename,
      };
    }

    const newPhotoGallery = new photoGallery({
      title,
      date,
      ...imagesData,
    });

    const savedPhotoGallery = await newPhotoGallery.save();

    return {
      status: 201,
      data: {
        message: "Photo listed successfully",
        photoGalleryId: savedPhotoGallery._id,
        savedPhotoGallery: savedPhotoGallery,
      },
    };
  } catch (error) {
    console.error("Error creating Photo:", error);
    return { status: 500, message: "Error creating Photo" };
  }
};

export const uploadPhotoGalleryImagesById = async (photoGalleryId, files) => {
  try {
    const updateData = {};

    if (files.find((file) => file.fieldname === "mainImage")) {
      updateData.mainImage = {
        image: files.find((file) => file.fieldname === "mainImage").filename,
      };
    }

    const updatedPhotoGallery = await photoGallery.findByIdAndUpdate(
      photoGalleryId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedPhotoGallery) {
      return { status: 404, message: "Photos not found" };
    }

    return { status: 200, data: updatedPhotoGallery };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { status: 500, message: "Error uploading images" };
  }
};

export const createMultiplePhotoGallery = async (photoData) => {
  try {
    const savedPhotoGallery = await photoGallery.insertMany(photoData);
    return { status: 201, data: savedPhotoGallery };
  } catch (error) {
    console.error("Error creating Photo:", error);
    return { status: 500, message: "Error creating Photo" };
  }
};
export const searchPhotoGalleryByTitle = async (title) => {
  return await photoGallery.find(
    { title: new RegExp(title, "i") }, // Case-insensitive search
    { _id: 1, title: 1 } // Select only the ID and title fields
  );
};
export const searchPhotoGalleryById = async (id) => {
  try {
    const temples = await photoGallery.find({ _id: id });
    return { status: 200, data: photos };
  } catch (error) {
    console.error("Error searching photos:", error);
    return { status: 500, message: "Error searching photos" };
  }
};

const deleteImage = (imageName) => {
  if (imageName) {
    const imagePath = path.join(
      __dirname,
      "../",
      "public",
      "photosGallery",
      imageName
    ); // Adjust the path according to your directory structure
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });
  }
};

export const deletePhotosGalleryById = async (id) => {
  try {
    const photos = await photoGallery.findById(id);
    if (!photos) {
      return { status: 404, message: "photos not found" };
    }

    // Delete the image files from the server
    deleteImage(temple.mainImage.image);

    await photoGallery.findByIdAndDelete(id);
    return { status: 200, message: "Photos deleted successfully" };
  } catch (error) {
    console.error("Error deleting photoGallery:", error);
    return { status: 500, message: "Error deleting photoGallery" };
  }
};

export const updatePhotosGalleryById = async (photoData) => {
  try {
    // Validate templeData object
    if (!photoData || !photoData.id) {
      return { status: 400, message: "Invalid photos data", data: null };
    }
    const updatedPhotosGallery = await photoGallery.findByIdAndUpdate(
      photoData.id,
      { $set: photoData },
      { new: true }
    );

    if (!updatedPhotosGallery) {
      return { status: 404, message: "Photos not found", data: null };
    }

    return {
      status: 200,
      message: "Photos updated successfully",
      data: updatedPhotosGallery,
    };
  } catch (error) {
    console.error("Error updating Photos:", error);
    return { status: 500, message: "Internal Server Error", data: null };
  }
};

export const getMainImage = async (id, res) => {
  try {
    const mainPicture = await Temple.findById(id).select("mainImage");
    if (mainPicture && mainPicture.mainImage && mainPicture.mainImage.data) {
      res.set("Content-Type", mainPicture.mainImage.contentType);
      return res.status(200).send(mainPicture.mainImage.data);
    } else {
      return res.status(404).send({ message: "Main image not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getMainImage",
      error: error.message,
    });
  }
};
// get slide temples
