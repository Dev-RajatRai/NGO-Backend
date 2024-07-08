// POST API to add new about data

export const addcommitemember = async (req, res) => {
    try {
      const { name, email, phone, state, city , country } =
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