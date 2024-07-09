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