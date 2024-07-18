import About from "../Models/About.js";
// GET API to find about data
export const getaboutdata = async (req, res, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const data = await About.find({})

      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title description visiondescription missiondescription image");
    if (!data) {
      return res.status(404).json({ message: "Information not found" });
    }
    console.log(data, "About-Us");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
// POST API to add new about data

export const postaboutdata = async (req, res) => {
  try {
    const { title, description, visiondescription, missiondescription } =
      req.body;

    if (
      !title ||
      !description ||
      !visiondescription ||
      !missiondescription ||
      !req.file
    ) {
      return res.status(400).json({ message: "" });
    }

    const newAbout = new About({
      title,
      description,
      visiondescription,
      missiondescription,
      image: `${req.file.filename}`,
    });

    const savedAbout = await newAbout.save();
    res.status(201).json(savedAbout);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// GET API to fetch about data by ID
export const getaboutdataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await About.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Information not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).send("Server Error");
  }
};

// DELETE API to delete about data by ID
export const deleteaboutdataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await About.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: "Information not found" });
    }
    res.status(200).json({ message: "Information deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).send("Server Error");
  }
};

export const updateAboutById = async (aboutData, files) => {
  try {
    if (!aboutData || !aboutData.id) {
      return { status: 400, message: "Invalid  About data" };
    }

    if (files.find((file) => file.fieldname === "image")) {
      aboutData.image = files.find(
        (file) => file.fieldname === "image"
      ).filename;
    }
    const updateData = { ...aboutData };
    if (!aboutData.image) {
      delete updateData.image;
    }

    const updateAboutData = await About.findByIdAndUpdate(
      aboutData.id,
      { $set: updateData },
      { new: true }
    );

    if (!updateAboutData) {
      return { status: 404, message: "About  not found" };
    }

    return {
      status: 200,
      data: {
        data: updateAboutData,
        message: "About  updated successfully",
      },
    };
  } catch (error) {
    console.error("Error updating About:", error);
    return { status: 500, message: "Internal server error" };
  }
};
