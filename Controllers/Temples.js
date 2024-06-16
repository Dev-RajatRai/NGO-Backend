import Temple from "../Models/Temples.js";
import fs from "fs";
export const getAllTemples = async (page, limit) => {
  try {
    const data = await Temple.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return { status: 200, data };
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw error;
  }
};

export const createTemple = async (req, res) => {
  try {
    console.log("Request Fields:", req.fields);
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
    } = req.fields;

    // Check if all required fields are present
    const requiredFields = {
      title,
      description,
      shortdescription,
      location,
      establishedDate,
      state,
      country,
      category,
      help,
    };
    const missingFields = Object.keys(requiredFields).filter(
      (key) => !requiredFields[key]
    );
    if (missingFields.length > 0) {
      return res.status(400).send({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const { mainImage, bannerImage, sub1, sub2, sub3 } = req.files;

    // File handling
    const readFile = (filePath) => {
      return fs.readFileSync(filePath);
    };

    const newTemple = new Temple({
      title,
      description,
      shortdescription,
      location,
      establishedDate,
      state,
      country,
      category,
      help,
      mainImage: {
        image: readFile(mainImage.path),
      },
      bannerImage: {
        image: readFile(bannerImage.path),
      },
      sub1: {
        image: readFile(sub1.path),
      },
      sub2: {
        image: readFile(sub2.path),
      },
      sub3: {
        image: readFile(sub3.path),
      },
    });
    await newTemple.save();

    res.status(201).send({
      success: true,
      message: "Temple created successfully",
      data: newTemple,
    });
  } catch (error) {
    console.error("Error creating temple:", error);
    res.status(500).send({
      success: false,
      message: "Error creating temple",
      error: error.message,
    });
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
export const deleteTempleById = async (id) => {
  try {
    const result = await Temple.findByIdAndDelete(id);
    if (result) {
      return { status: 200, message: "Temple deleted successfully" };
    } else {
      return { status: 404, message: "Temple not found" };
    }
  } catch (error) {
    console.error("Error deleting temple:", error);
    return { status: 500, message: "Error deleting temple" };
  }
};

export const updateTempleById = async (templeData) => {
  try {
    const result = await Temple.findByIdAndUpdate(templeData.id, templeData, {
      new: true,
      runValidators: true,
    });
    if (result) {
      return {
        status: 200,
        data: result,
        message: "Temple updated successfully",
      };
    } else {
      return { status: 404, message: "Temple not found" };
    }
  } catch (error) {
    console.error("Error updating temple:", error);
    return { status: 500, message: "Error updating temple" };
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
      .select("shortdescription mainImage title id");

    if (temples.length === 0) {
      return res.status(404).json({ status: 404, message: "No temples found" });
    }

    res.status(200).json({ status: 200, data: temples });
  } catch (error) {
    console.error("Error fetching temples:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
