// controllers/Users.js

import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Temple from "../Models/Temples.js";
import Events from "../Models/Events.js";
// Get all users
export const getAllUsers = async () => {
  try {
    const members = await User.find({ type: "member" });
    return { status: 200, data: members };
  } catch (error) {
    console.error("Error retrieving users:", error);
    return { status: 500, message: "Error retrieving users" };
  }
};
export const getAllAdmin = async () => {
  try {
    const members = await User.find({ type: "admin" });
    return { status: 200, data: members };
  } catch (error) {
    console.error("Error retrieving users:", error);
    return { status: 500, message: "Error retrieving users" };
  }
};

export const getAllUsersName = async () => {
  try {
    const users = await User.find().select("name _id");
    return { status: 200, data: users };
  } catch (error) {
    console.error("Error retrieving users:", error);
    return { status: 500, message: "Error retrieving users" };
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      designation,
      location,
      state,
      city,
      country,
      phone,
      type,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Create a new user object
    const userData = {
      name,
      email,
      password,
      designation,
      location,
      state,
      city,
      country,
      phone,
      type,
      photo: {
        image: req.files?.[0]?.filename,
      },
    };

    // Create a new User instance
    const newUser = new User(userData);

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Return the created user with status 201
    res.status(201).json({
      status: 201,
      data: {
        data: savedUser,
        message: "User created successfully",
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating user:", error);

    // Return an error response with status 500
    res.status(500).json({ message: "Error creating user" });
  }
};

// Get a user by ID
export const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const templeCount = await Temple.countDocuments({});
      const eventCount = await Events.countDocuments({});

      // Include templeCount and eventCount inside the user object
      const userWithCounts = {
        ...user.toObject(), // Convert Mongoose document to plain JavaScript object
        templeCount,
        eventCount,
      };

      return {
        status: 200,
        data: userWithCounts,
      };
    } else {
      return { status: 404, message: "User not found" };
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return { status: 500, message: "Error retrieving user" };
  }
};

// Update a user by ID
export const updateUserById = async (userData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userData.id, userData, {
      new: true,
      runValidators: true,
    });
    if (updatedUser) {
      return {
        status: 200,
        data: {
          data: updatedUser,
          message: "user updated successfully",
        },
      };
    } else {
      return { status: 404, message: "User not found" };
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return { status: 500, message: "Error updating user" };
  }
};

// Delete a user by ID
export const deleteUserById = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      return { status: 200, message: "User deleted successfully" };
    } else {
      return { status: 404, message: "User not found" };
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return { status: 500, message: "Error deleting user" };
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 401, message: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { status: 401, message: "Invalid email or password" };
    }

    const token = await jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      {
        expiresIn: "7h",
      }
    );

    return { status: 200, data: { token, user } };
  } catch (error) {
    console.error("Error logging in user:", error);
    return { status: 500, message: "Error logging in user" };
  }
};

// Get members by location
export const getMembersByLocation = async (location) => {
  try {
    const members = await User.find({ location });
    return members;
  } catch (error) {
    console.error("Error retrieving members by location:", error);
    throw error;
  }
};
