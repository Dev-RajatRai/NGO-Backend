// POST API to add new about data
import committeMember from "../Models/Commitemember.js";

export const getcommitemember = async (req, res) => {
    try {
      const members = await committeMember.find({});
      if(!members){
        res.json("no data found")
      }
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }



  // POST endpoint to add a new committee member with multiple photos

export const addcommitemember=async (req, res) => {
  try {
    const {
      name,
      fathername,
      mothername,
      email,
      phone,
      adhare,
      address,
      city,
      state,
      country,
      purpose
    } = req.body;


    // const imagesData = {};
    // console.log("dd",imagesData)
    // if (req.files.find((file) => file.fieldname === "photo")) {
    //   imagesData.photo = file.filename
    // }
    // const imagesData = {};
    // if (req.files.find((file) => file.fieldname === "photo")) {
    //   imagesData.photo = {
    //     image: files.find((file) => file.fieldname === "photo").filename,
    //   };
    // }

    // if (req.files.find((file) => file.fieldname === "Adharephoto")) {
    //   imagesData.Adharephoto = [{
    //     image: files.find((file) => file.fieldname === "Adharephoto").filename,
    //   }];
    // // }
    // const photo=req.files['photo'].filename
    // const photo = req.files['photo'] ? req.files['photo'][0].path : '';
    // const Adharephotos = req.files['Adharephoto'] ? req.files['Adharephoto'].map(file => ({ image: file.path })) : [];
    // const Adharephotos = req.files['Adharephoto'].filename.map((file)=>);

    // Create new committee member instance
    const newMember = new committeMember({
      name,
      fathername,
      mothername,
      email,
      phone,
      adhare,
      address,
      city,
      state,
      country,
      purpose,
  
    
    });
   
  // Adharephoto: Adharephotos,
    // Save committee member to database
    await newMember.save();

    res.status(201).json(newMember);
  } catch (err) {
    console.error('Error creating committee member:', err);
    res.status(500).json({ error: 'Failed to create committee member' });
  }
}