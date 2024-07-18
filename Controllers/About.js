import About from "../Models/About.js";
// GET API to find about data
export const getAllAboutData = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const data = await About.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("  title  description visiondescription missiondescription  ");

    return { status: 200, data };
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

    const newAboutData = new About({
      title,
      description,
      visiondescription,
      missiondescription,
    });

    const savedAboutData = await newAboutData.save();

    return {
      status: 201,
      message: "About listed successfully",
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

// DELETE API to delete about data by ID
export const deleteAboutById = async (id) => {
  try {
    const data = await About.findById(id);
    if (!data) {
      return { status: 404, message: "About not found" };
    }

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
    const updateAboutData = await About.findByIdAndUpdate(
      AboutData.id,
      { $set: AboutData },
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
