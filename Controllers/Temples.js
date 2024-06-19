import Temple from "../Models/Temples.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getAllTemples = async (page, limit) => {
  try {
    const data = await Temple.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { status: 200, data };
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw error;
  }
};
export const createTempleWithoutImages = async (templeData) => {
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
    });

    const savedTemple = await newTemple.save();

    return {
      status: 201,
      data: {
        message: "Temple listed successfully",
        templeId: savedTemple._id,
      },
    };
  } catch (error) {
    console.error("Error creating temple:", error);
    return { status: 500, message: "Error creating temple" };
  }
};
export const uploadTempleImagesById = async (templeId, files) => {
  try {
    const uploadedImages = {
      mainImage: files.find((file) => file.fieldname === "mainImage")?.filename,
      bannerImage: files.find((file) => file.fieldname === "bannerImage")
        ?.filename,
      sub1: files.find((file) => file.fieldname === "sub1")?.filename,
      sub2: files.find((file) => file.fieldname === "sub2")?.filename,
      sub3: files.find((file) => file.fieldname === "sub3")?.filename,
    };

    const updatedTemple = await Temple.findByIdAndUpdate(
      templeId,
      {
        mainImage: { image: uploadedImages.mainImage },
        bannerImage: { image: uploadedImages.bannerImage },
        sub1: { image: uploadedImages.sub1 },
        sub2: { image: uploadedImages.sub2 },
        sub3: { image: uploadedImages.sub3 },
      },
      { new: true }
    );

    if (!updatedTemple) {
      return { status: 404, message: "Temple not found" };
    }

    return { status: 200, data: updatedTemple };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { status: 500, message: "Error uploading images" };
  }
};

// export const createTemple = async (req, res) => {
//   try {
//     console.log("Request Fields:", req.fields);
//     const {
//       title,
//       description,
//       shortdescription,
//       location,
//       establishedDate,
//       state,
//       country,
//       category,
//       help,
//     } = req.fields;

//     // Check if all required fields are present
//     const requiredFields = {
//       title,
//       description,
//       shortdescription,
//       location,
//       establishedDate,
//       state,
//       country,
//       category,
//       help,
//     };
//     const missingFields = Object.keys(requiredFields).filter(
//       (key) => !requiredFields[key]
//     );
//     if (missingFields.length > 0) {
//       return res.status(400).send({
//         error: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     const { mainImage, bannerImage, sub1, sub2, sub3 } = req.files;

//     // File handling
//     const readFile = (filePath) => {
//       return fs.readFileSync(filePath);
//     };

//     const newTemple = new Temple({
//       title,
//       description,
//       shortdescription,
//       location,
//       establishedDate,
//       state,
//       country,
//       category,
//       help,
//       mainImage: {
//         image: readFile(mainImage.path),
//       },
//       bannerImage: {
//         image: readFile(bannerImage.path),
//       },
//       sub1: {
//         image: readFile(sub1.path),
//       },
//       sub2: {
//         image: readFile(sub2.path),
//       },
//       sub3: {
//         image: readFile(sub3.path),
//       },
//     });
//     await newTemple.save();

//     res.status(201).send({
//       success: true,
//       message: "Temple created successfully",
//       data: newTemple,
//     });
//   } catch (error) {
//     console.error("Error creating temple:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error creating temple",
//       error: error.message,
//     });
//   }
// };

export const createMultipleTemples = async (templesData) => {
  try {
    const savedTemples = await Temple.insertMany(templesData);
    return { status: 201, data: savedTemples };
  } catch (error) {
    console.error("Error creating temples:", error);
    return { status: 500, message: "Error creating temples" };
  }
};
export const searchTemplesByTitle = async (searchTerm) => {
  try {
    const regex = new RegExp(searchTerm, "i"); // 'i' makes it case-insensitive
    const temples = await Temple.find({ title: regex });
    return { status: 200, data: temples };
  } catch (error) {
    console.error("Error searching temples:", error);
    return { status: 500, message: "Error searching temples" };
  }
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
    deleteImage(temple.sub1.image);
    deleteImage(temple.sub2.image);
    deleteImage(temple.sub3.image);

    await Temple.findByIdAndDelete(id);
    return { status: 200, message: "Temple deleted successfully" };
  } catch (error) {
    console.error("Error deleting temple:", error);
    return { status: 500, message: "Error deleting temple" };
  }
};

export const updateTempleById = async (templeData) => {
  try {
    // Validate templeData object
    if (!templeData || !templeData.id) {
      return { status: 400, message: "Invalid temple data", data: null };
    }
    const updatedTemple = await Temple.findByIdAndUpdate(
      templeData.id,
      { $set: templeData },
      { new: true }
    );

    if (!updatedTemple) {
      return { status: 404, message: "Temple not found", data: null };
    }

    return {
      status: 200,
      message: "Temple updated successfully",
      data: updatedTemple,
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

export const getTempSlide = async (req, res) => {
  try {
    const temples = await Temple.find({ category: "slide-image" })
      .sort({ createdAt: -1 })
      .limit(10)
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
