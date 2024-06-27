import About from "../Models/About.js"
// GET API to find about data
export const getaboutdata =async(req,res)=>{
    try {
     const data= await About.find({})
     if (!data) {
        return res.status(404).json({ message: "Information not found" });
      }
      res.status(200).json(data)
    } catch (error) {
        res.status(500).send('Server Error');
    }

}
// POST API to add new about data

export const postaboutdata = async (req, res) => {
    try {
      const { title, description, visiondescription, missiondescription } = req.body;
  
      if (!title || !description || !visiondescription || !missiondescription) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const newAbout = new About({
        title,
        description,
        visiondescription,
        missiondescription
      });
  
      const savedAbout = await newAbout.save();
      res.status(201).json(savedAbout);
    } catch (error) {
      res.status(500).send('Server Error');
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
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      res.status(500).send('Server Error');
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
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      res.status(500).send('Server Error');
    }
  };