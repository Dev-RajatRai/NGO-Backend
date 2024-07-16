// POST API to add new about data
import committeMember from "../Models/Commitemember.js";

export const getcommitemember = async (req, res) => {
  try {
    const members = await committeMember.find({});
    if (!members) {
      res.json("no data found");
    }
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const addcommitemember = async (memberData, files, res) => {
//   try {
//     const {
//       name,
//       fathername,
//       mothername,
//       email,
//       phone,
//       adhare,
//       address,
//       city,
//       state,
//       country,
//       purpose,
//     } = memberData;

//     const requiredFields = {
//       name,
//       fathername,
//       mothername,
//       email,
//       phone,
//       adhare,
//       address,
//       city,
//       state,
//       country,
//       purpose,
//     };

//     const missingFields = Object.keys(requiredFields).filter(
//       (key) => !requiredFields[key]
//     );

//     if (missingFields.length > 0) {
//       return {
//         status: 400,
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       };
//     }

//     const imagesData = {};
//     if (files.find((file) => file.fieldname === "photo")) {
//       imagesData.photo = {
//         image: files.find((file) => file.fieldname === "photo").filename,
//       };
//     }
//     if (files.find((file) => file.fieldname === "Adharefront")) {
//       imagesData.Adharefront = {
//         image: files.find((file) => file.fieldname === "Adharefront").filename,
//       };
//     }
//     if (files.find((file) => file.fieldname === "Adhareback")) {
//       imagesData.Adhareback = {
//         image: files.find((file) => file.fieldname === "Adhareback").filename,
//       };
//     }

//     // Create new committee member instance
//     const newMember = new committeMember({
//       name,
//       fathername,
//       mothername,
//       email,
//       phone,
//       adhare,
//       address,
//       city,
//       state,
//       country,
//       purpose,
//       ...imagesData,
//     });

//     await newMember.save();

//     // Respond with the newly created member
//     res.status(201).json(newMember);
//   } catch (err) {
//     console.error("Error creating committee member:", err);
//     res.status(500).json({ error: "Failed to create committee member" });
//   }
// };
export const createCommitteMember = async (committeMemberData, files) => {
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
      purpose,
    } = committeMemberData;

    const requiredFields = {
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
    if (files.find((file) => file.fieldname === "photo")) {
      imagesData.photo = {
        image: files.find((file) => file.fieldname === "photo").filename,
      };
    }
    if (files.find((file) => file.fieldname === "Adharefront")) {
      imagesData.Adharefront = {
        image: files.find((file) => file.fieldname === "Adharefront").filename,
      };
    }
    if (files.find((file) => file.fieldname === "Adhareback")) {
      imagesData.Adhareback = {
        image: files.find((file) => file.fieldname === "Adhareback").filename,
      };
    }
    const newCommitteMember = new committeMember({
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
      ...imagesData,
    });
    const savedCommitteMember = await newCommitteMember.save();

    return {
      status: 201,
      data: {
        data: savedCommitteMember,
        message: "Committe Member created successfully",
      },
    };
  } catch (error) {
    console.error("Error creating Committe Member:", error);
    return { status: 500, message: "Error creating Committe Member" };
  }
};

export const updatecommitemember = async (req, res) => {
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
      purpose,
    } = req.body;

    const { id } = req.params;

    const imagesData = {};
    if (req.files.find((file) => file.fieldname === "photo")) {
      imagesData.photo = {
        image: req.files.find((file) => file.fieldname === "photo").filename,
      };
    }
    if (req.files.find((file) => file.fieldname === "Adharefront")) {
      imagesData.Adharefront = {
        image: req.files.find((file) => file.fieldname === "Adharefront")
          .filename,
      };
    }
    if (req.files.find((file) => file.fieldname === "Adhareback")) {
      imagesData.Adhareback = {
        image: req.files.find((file) => file.fieldname === "Adhareback")
          .filename,
      };
    }

    // Construct updated member object
    const updatedMember = {
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
      ...imagesData,
    };

    // Update and get updated document
    const updatedMedia = await committeMember.findByIdAndUpdate(
      id,
      { $set: updatedMember },
      { new: true }
    );

    if (!updatedMedia) {
      return res.status(404).json({ error: "Committee member not found" });
    }

    res.status(200).json(updatedMedia);
  } catch (err) {
    console.error("Error updating committee member:", err);
    res.status(500).json({ error: "Failed to update committee member" });
  }
};

export const getcommiteMemberById = async (req, res) => {
  try {
    const memberId = req.params.id; // Assuming 'id' is the parameter in the URL

    // Fetch the member from the database
    const member = await committeMember.findById(memberId);

    if (!member) {
      return res.status(404).json({ error: "Committee member not found" });
    }

    res.status(200).json(member);
  } catch (err) {
    console.error("Error fetching committee member by ID:", err);
    res.status(500).json({ error: "Failed to fetch committee member" });
  }
};

export const deletecommiteMemberById = async (req, res) => {
  try {
    const memberId = req.params.id; // Assuming 'id' is the parameter in the URL

    // Find and delete the member from the database
    const deletedMember = await committeMember.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return res.status(404).json({ error: "Committee member not found" });
    }

    res.status(200).json({ message: "Committee member deleted successfully" });
  } catch (err) {
    console.error("Error deleting committee member:", err);
    res.status(500).json({ error: "Failed to delete committee member" });
  }
};
