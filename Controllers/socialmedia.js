import Social from "../Models/Socialmedia.js";

export const getsocialdata = async (req, res) => {
    try {
      const data = await Social.find();
      if (!data) {
        return res.status(404).json({ message: "Information not found" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  };

  export const postmediadata = async (req, res) => {
    try {
      const { name, designation, facebook, twitter } =
        req.body;
  
      if (
        !name ||
        !designation ||
        !facebook ||
        !twitter ||
        !req.file
      ) {
        return res.status(400).json({ message: "" });
      }
  
      const newSocial = new Social({
        name,
        designation,
        facebook,
        twitter,
        image: `${req.file.filename}`,
      });
  
      const savedmedia = await newSocial.save();
      res.status(201).json(savedmedia);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  };  

  export const updatemediadata = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, designation, facebook, twitter } = req.body;
  
      // Check if required fields are provided
      if (!name || !designation || !facebook || !twitter) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Prepare the update object
      const updateFields = {
        name,
        designation,
        facebook,
        twitter
      };
  
      // Check if an image file is provided
      if (req.file) {
        updateFields.image = req.file.filename;
      }
  
      // Find the document by ID and update
      const updatedMedia = await Social.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );
  
      if (!updatedMedia) {
        return res.status(404).json({ message: "Media data not found" });
      }
  
      res.status(200).json(updatedMedia);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  };
