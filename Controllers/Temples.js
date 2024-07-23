import Temple from "../Models/Temples.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllTemples = async (page, limit) => {
  const skip = page * limit;
  try {
    const data = await Temple.find({})

      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const count = await Temple.find({}).estimatedDocumentCount();
    return { status: 200, data: data, count: count };
  } catch (error) {
    console.error("Error retrieving temples:", error);
    throw error;
  }
};
export const createTemple = async (templeData, files) => {
  try {
    const {
      title,
      description,
      shortdescription,
      location,
      establishedDate,
      state,
      country,
      category,
      help,
      city,
    } = templeData;

    const requiredFields = {
      title,
      description,
      shortdescription,
      location,
      establishedDate,
      state,
      city,
      country,
      category,
      help,
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
    if (files.find((file) => file.fieldname === "bannerImage")) {
      imagesData.bannerImage = {
        image: files.find((file) => file.fieldname === "bannerImage").filename,
      };
    }
    // if (files.find((file) => file.fieldname === "sub1")) {
    //   imagesData.sub1 = {
    //     image: files.find((file) => file.fieldname === "sub1").filename,
    //   };
    // }
    // if (files.find((file) => file.fieldname === "sub2")) {
    //   imagesData.sub2 = {
    //     image: files.find((file) => file.fieldname === "sub2").filename,
    //   };
    // }
    // if (files.find((file) => file.fieldname === "sub3")) {
    //   imagesData.sub3 = {
    //     image: files.find((file) => file.fieldname === "sub3").filename,
    //   };
    // }

    const subImages = files
      .filter((file) => file.fieldname.startsWith("sub"))
      .map((file) => ({ image: file.filename }));

    const newTemple = new Temple({
      title,
      description,
      shortdescription,
      location,
      establishedDate,
      state,
      city,
      country,
      category,
      help,
      ...imagesData, // Spread imagesData directly into the Temple object
      subImages,
    });
    console.log("dss", newTemple);
    const savedTemple = await newTemple.save();

    return {
      status: 201,
      data: {
        message: "Temple listed successfully",
        templeId: savedTemple._id,
        savedTemple: savedTemple,
      },
    };
  } catch (error) {
    console.error("Error creating temple:", error);
    return { status: 500, message: "Error creating temple" };
  }
};

export const uploadTempleImagesById = async (templeId, files) => {
  try {
    const updateData = {};

    if (files.find((file) => file.fieldname === "mainImage")) {
      updateData.mainImage = {
        image: files.find((file) => file.fieldname === "mainImage").filename,
      };
    }
    if (files.find((file) => file.fieldname === "bannerImage")) {
      updateData.bannerImage = {
        image: files.find((file) => file.fieldname === "bannerImage").filename,
      };
    }
    if (files.find((file) => file.fieldname === "sub1")) {
      updateData.sub1 = {
        image: files.find((file) => file.fieldname === "sub1").filename,
      };
    }
    if (files.find((file) => file.fieldname === "sub2")) {
      updateData.sub2 = {
        image: files.find((file) => file.fieldname === "sub2").filename,
      };
    }
    if (files.find((file) => file.fieldname === "sub3")) {
      updateData.sub3 = {
        image: files.find((file) => file.fieldname === "sub3").filename,
      };
    }

    const updatedTemple = await Temple.findByIdAndUpdate(templeId, updateData, {
      new: true,
    });

    if (!updatedTemple) {
      return { status: 404, message: "Temple not found" };
    }

    return { status: 200, data: updatedTemple };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { status: 500, message: "Error uploading images" };
  }
};

export const createMultipleTemples = async (templesData) => {
  try {
    const savedTemples = await Temple.insertMany(templesData);
    return { status: 201, data: savedTemples };
  } catch (error) {
    console.error("Error creating temples:", error);
    return { status: 500, message: "Error creating temples" };
  }
};
export const searchTemplesByTitle = async (title) => {
  return await Temple.find(
    { title: new RegExp(title, "i") }, // Case-insensitive search
    { _id: 1, title: 1 } // Select only the ID and title fields
  );
};
export const searchTempleById = async (id) => {
  try {
    const temples = await Temple.find({ _id: id });
    return { status: 200, data: temples };
  } catch (error) {
    console.error("Error searching temples:", error);
    return { status: 500, message: "Error searching temples" };
  }
};

const deleteImage = (imageName) => {
  if (imageName) {
    const imagePath = path.join(
      __dirname,
      "../",
      "public",
      "temples",
      imageName
    ); // Adjust the path according to your directory structure
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });
  }
};

export const deleteTempleById = async (id) => {
  try {
    const temple = await Temple.findById(id);
    if (!temple) {
      return { status: 404, message: "Temple not found" };
    }

    // Delete the image files from the server
    deleteImage(temple.mainImage.image);
    deleteImage(temple.bannerImage.image);
    deleteImage(temple.subImages.image);
    // deleteImage(temple.sub2.image);
    // deleteImage(temple.sub3.image);

    await Temple.findByIdAndDelete(id);
    return { status: 200, message: "Temple deleted successfully" };
  } catch (error) {
    console.error("Error deleting temple:", error);
    return { status: 500, message: "Error deleting temple" };
  }
};

export const updateTempleById = async (templeData, files) => {
  try {
    // Validate templeData object
    if (!templeData || !templeData.id) {
      return { status: 400, message: "Invalid temple data", data: null };
    }

    const imagesData = {};
    if (files.find((file) => file.fieldname === "mainImage")) {
      imagesData.mainImage = {
        image: files.find((file) => file.fieldname === "mainImage").filename,
      };
    }
    if (files.find((file) => file.fieldname === "bannerImage")) {
      imagesData.bannerImage = {
        image: files.find((file) => file.fieldname === "bannerImage").filename,
      };
    }

    const subImages = files
      .filter((file) => file.fieldname.startsWith("sub"))
      .map((file) => ({ image: file.filename }));

    const updateTemple = {
      ...templeData,
      ...imagesData, // Spread imagesData directly into the Temple object
      subImages,
    };

    const updatedTemple = await Temple.findByIdAndUpdate(
      templeData.id,
      { $set: updateTemple },
      { new: true }
    );

    if (!updatedTemple) {
      return { status: 404, message: "Temple not found", data: null };
    }

    return {
      status: 200,
      data: {
        data: updatedTemple,
        message: "Temple updated successfully",
      },
    };
  } catch (error) {
    console.error("Error updating temple:", error);
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
export const getTempSlide = async (req, res) => {
  try {
    const temples = await Temple.find({ category: "temp-slide" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("shortdescription mainImage title id establishedDate city state");

    if (temples.length === 0) {
      return res.status(404).json({ status: 404, message: "No temples found" });
    }

    res.status(200).json({ status: 200, data: temples });
  } catch (error) {
    console.error("Error fetching temples:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// get famous temples
export const getFamousTemp = async (req, res) => {
  try {
    const temples = await Temple.find({ category: "famous" })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("shortdescription mainImage title id establishedDate");

    if (temples.length === 0) {
      return res.status(404).json({ status: 404, message: "No temples found" });
    }

    res.status(200).json({ status: 200, data: temples });
  } catch (error) {
    console.error("Error fetching temples:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
