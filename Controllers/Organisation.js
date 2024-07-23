import Organisation from "../Models/Organisation.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllOrganisation = async (page, limit) => {
  const skip = page * limit;
  try {
    const data = await Organisation.find({})

      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const count = await Organisation.find({}).estimatedDocumentCount();
    return { status: 200, data: data, count: count };
  } catch (error) {
    console.error("Error retrieving Organisation:", error);
    throw error;
  }
};
export const createOrganisation = async (organisationData, files) => {
  try {
    const { title, description, phone, email } = organisationData;

    const requiredFields = {
      title,
      description,
      phone,
      email,
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
    if (files.find((file) => file.fieldname === "mainImage")) {
      imagesData.mainImage = {
        image: files.find((file) => file.fieldname === "mainImage").filename,
      };
    }

    const subImages = files
      .filter((file) => file.fieldname.startsWith("sub"))
      .map((file) => ({ image: file.filename }));

    const newOrganisation = new Organisation({
      title,
      description,
      phone,
      email,
      ...imagesData,
      subImages,
    });
    console.log("dss", newOrganisation);
    const savedOrganisation = await newOrganisation.save();

    return {
      status: 201,
      data: {
        message: "Organisation listed successfully",
        organisationId: savedOrganisation._id,
        savedOrganisation: savedOrganisation,
      },
    };
  } catch (error) {
    console.error("Error creating Organisation:", error);
    return { status: 500, message: "Error creating Organisation" };
  }
};

export const uploadOrganisationById = async (organisationId, files) => {
  try {
    const updateData = {};

    if (files.find((file) => file.fieldname === "mainImage")) {
      updateData.mainImage = {
        image: files.find((file) => file.fieldname === "mainImage").filename,
      };
    }

    if (files.find((file) => file.fieldname === "sub1")) {
      updateData.sub1 = {
        image: files.find((file) => file.fieldname === "sub1").filename,
      };
    }
    if (files.find((file) => file.fieldname === "sub2")) {
      updateData.sub2 = {
        image: files.find((file) => file.fieldname === "sub2").filename,
      };
    }
    if (files.find((file) => file.fieldname === "sub3")) {
      updateData.sub3 = {
        image: files.find((file) => file.fieldname === "sub3").filename,
      };
    }

    const updatedOrganisation = await Organisation.findByIdAndUpdate(
      organisationId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedOrganisation) {
      return { status: 404, message: "Organisation not found" };
    }

    return { status: 200, data: updatedOrganisation };
  } catch (error) {
    console.error("Error uploading images:", error);
    return { status: 500, message: "Error uploading images" };
  }
};

export const searchOrganisationById = async (id) => {
  try {
    const organisations = await Organisation.find({ _id: id });
    return { status: 200, data: organisations };
  } catch (error) {
    console.error("Error searching organisations:", error);
    return { status: 500, message: "Error searching organisations" };
  }
};

const deleteImage = (imageName) => {
  if (imageName) {
    const imagePath = path.join(
      __dirname,
      "../",
      "public",
      "organisations",
      imageName
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });
  }
};

export const deleteOrganisationById = async (id) => {
  try {
    const organisation = await Organisation.findById(id);
    if (!organisation) {
      return { status: 404, message: "organisation not found" };
    }
    deleteImage(organisation.mainImage.image);
    deleteImage(organisation.subImages.image);

    await Organisation.findByIdAndDelete(id);
    return { status: 200, message: "Organisation deleted successfully" };
  } catch (error) {
    console.error("Error deleting Organisation:", error);
    return { status: 500, message: "Error deleting Organisation" };
  }
};

export const updateOrganisationById = async (organisationData, files) => {
  try {
    // Validate templeData object
    if (!organisationData || !organisationData.id) {
      return { status: 400, message: "Invalid organisation data", data: null };
    }

    const imagesData = {};
    if (files.find((file) => file.fieldname === "mainImage")) {
      imagesData.mainImage = {
        image: files.find((file) => file.fieldname === "mainImage").filename,
      };
    }

    const subImages = files
      .filter((file) => file.fieldname.startsWith("sub"))
      .map((file) => ({ image: file.filename }));

    const updateOrganisation = {
      ...organisationData,
      ...imagesData,
      subImages,
    };

    const updatedOrganisation = await Organisation.findByIdAndUpdate(
      organisationData.id,
      { $set: updateOrganisation },
      { new: true }
    );

    if (!updatedOrganisation) {
      return { status: 404, message: "Organisation not found", data: null };
    }

    return {
      status: 200,
      data: {
        data: updatedOrganisation,
        message: "Organisation updated successfully",
      },
    };
  } catch (error) {
    console.error("Error updating organisation:", error);
    return { status: 500, message: "Internal Server Error", data: null };
  }
};
