import About from "../Models/AboutCards.js"


// GET API to find about data
export const getaboutCarddata =async(req,res)=>{
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

// export const postaboutCarddata = async (req, res) => {
//     try {
//       const { title, description} = req.body;
  
//       if (!title || !description ) {
//         return res.status(400).json({ message: 'All fields are required' });
//       }
  
//       const newAbout = new About({
//         title,
//         description,
       
//       });
  
//       const savedAbout = await newAbout.save();
//       res.status(201).json(savedAbout);
//     } catch (error) {
//       res.status(500).send('Server Error');
//     }
//   };

// Set up storage engine and multer configuration as shown above

export const postaboutCarddata= async (req, res) => {
    console.log(req.file,req.body,16)
    try {
        const { title, description } = req.body;

        if (!title || !description || !req.file) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newAbout = new About({
            title,
            description,
            image: `${req.file.filename}`
        });

        const savedAbout = await newAbout.save();
        res.status(201).json(savedAbout);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

  // GET API to fetch about data by ID
export const getaboutCarddataById = async (req, res) => {
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
export const deleteaboutCarddataById = async (req, res) => {
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