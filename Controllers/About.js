import About from "../Models/About.js";
// GET API to find about data
export const getAllAboutData = async (page, limit) => {
  try {
    const skip = page * limit;
    const data = await About.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return { status: 200, data: data };
  } catch (error) {
    console.error("Error retrieving About:", error);
    throw error;
  }
};
// POST API to add new about data

export const createAboutData = async (AboutData, files) => {
  try {
    const { title, description, visiondescription, missiondescription } =
      AboutData;

    const requiredFields = {
      title,
      description,
      visiondescription,
      missiondescription,
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
    if (files.find((file) => file.fieldname === "aboutImage")) {
      imagesData.aboutImage = {
        image: files.find((file) => file.fieldname === "aboutImage").filename,
      };
    }

    const newAboutData = new About({
      title,
      description,
      visiondescription,
      missiondescription,
      ...imagesData,
    });

    const savedAboutData = await newAboutData.save();

    return {
      status: 201,
      data: {
        data: savedAboutData,
        message: "About listed successfully",
      },
    };
  } catch (error) {
    console.error("Error creating About:", error);
    return { status: 500, message: "Error creating About" };
  }
};

// GET API to fetch about data by ID
export const searchAboutById = async (id) => {
  try {
    const data = await About.findOne({ _id: id });
    return { status: 200, data: data };
  } catch (error) {
    console.error("Error searching About:", error);
    return { status: 500, message: "Error searching About" };
  }
};

const deleteImage = (imageName) => {
  if (imageName) {
    const imagePath = path.join(__dirname, "../", "public", "about", imageName); // Adjust the path according to your directory structure
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });
  }
};
// DELETE API to delete about data by ID
export const deleteAboutById = async (id) => {
  try {
    const data = await About.findById(id);
    if (!data) {
      return { status: 404, message: "About not found" };
    }

    deleteImage(data.aboutImage.image);

    await About.findByIdAndDelete(id);
    return { status: 200, message: "About deleted successfully" };
  } catch (error) {
    console.error("Error deleting About:", error);
    return { status: 500, message: "Error deleting About " };
  }
};

export const updateAboutById = async (AboutData, files) => {
  try {
    // Validate Press-Reliese  object
    if (!AboutData || !AboutData.id) {
      return { status: 400, message: "Invalid About data", data: null };
    }

    const imagesData = {};
    if (files.find((file) => file.fieldname === "aboutImage")) {
      imagesData.aboutImage = {
        image: files.find((file) => file.fieldname === "aboutImage").filename,
      };
    }

    const updateAbout = {
      ...AboutData,
      ...imagesData,
    };

    const updateAboutData = await About.findByIdAndUpdate(
      AboutData.id,
      { $set: updateAbout },
      { new: true }
    );

    if (!updateAboutData) {
      return { status: 404, message: "About not found", data: null };
    }

    return {
      status: 200,

      data: {
        data: updateAboutData,
        message: "About updated successfully",
      },
    };
  } catch (error) {
    console.error("Error updating About:", error);
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
