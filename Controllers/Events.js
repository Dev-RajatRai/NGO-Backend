import axios from "axios";
import Events from "../Models/Events.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImage = (imageName) => {
  if (imageName) {
    const imagePath = path.join(
      __dirname,
      "../",
      "public",
      "events",
      imageName
    ); // Adjust the path according to your directory structure
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });
  }
};

export const getAllEvents = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const Eventss = await Events.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title description location eventImage startDate endDate organizer category"
      );
    return { status: 201, data: Eventss };
  } catch (error) {
    console.error("Error retrieving Eventss:", error);
    throw error;
  }
};
export const getUpcomingEvents = async () => {
  try {
    const currentDate = new Date();
    const upcomingEvents = await Events.find({
      startDate: { $gt: currentDate },
    });

    if (upcomingEvents.length === 0) {
      return { status: 200, message: "There are no upcoming events" };
    }

    return { status: 200, data: upcomingEvents };
  } catch (error) {
    console.error("Error retrieving upcoming events:", error);
    return { status: 500, message: "Error retrieving upcoming events" };
  }
};
export const getCurrentEvents = async () => {
  try {
    const currentDate = new Date();
    const currentEvents = await Events.find({
      startDate: { $lte: currentDate }, // Start date is less than or equal to current date
      endDate: { $gte: currentDate }, // End date is greater than or equal to current date
    });

    if (currentEvents.length === 0) {
      return { status: 200, message: "There are no events currently running" };
    }

    return { status: 200, data: currentEvents };
  } catch (error) {
    console.error("Error retrieving current events:", error);
    return { status: 500, message: "Error retrieving current events" };
  }
};

export const getPreviousEvents = async () => {
  try {
    const currentDate = new Date();
    const previousEvents = await Events.find({
      endDate: { $lt: currentDate },
    });

    if (previousEvents.length === 0) {
      return { status: 200, message: "There are no previous events" };
    }

    return { status: 200, data: previousEvents };
  } catch (error) {
    console.error("Error retrieving previous events:", error);
    return { status: 500, message: "Error retrieving previous events" };
  }
};

export const searchEventById = async (id) => {
  try {
    const events = await Events.find({ _id: id });
    return { status: 200, data: events };
  } catch (error) {
    console.error("Error searching temples:", error);
    return { status: 500, message: "Error searching Events" };
  }
};
export const createEvents = async (EventsData) => {
  try {
    const newEvents = new Events(EventsData);
    const savedEvents = await newEvents.save();
    return {
      status: 201,
      data: {
        data: savedEvents,
        message: "Event created successfully",
      },
    };
  } catch (error) {
    console.error("Error creating Events:", error);
    return { status: 500, message: "Error creating Events" };
  }
};

export const createMultipleEvents = async (EventsData) => {
  try {
    const savedEvents = await Events.insertMany(EventsData);
    return { status: 201, data: savedEvents };
  } catch (error) {
    console.error("Error creating Eventss:", error);
    return { status: 500, message: "Error creating Eventss" };
  }
};
export const searchEventssByTitle = async (searchTerm) => {
  try {
    const regex = new RegExp(searchTerm, "i");
    const Eventss = await Events.find({ title: regex });
    return { status: 200, data: Eventss };
  } catch (error) {
    console.error("Error searching Eventss:", error);
    return { status: 500, message: "Error searching Eventss" };
  }
};
export const deleteEventsById = async (id) => {
  try {
    const Event = await Events.findById(id);
    if (!Event) {
      return { status: 404, message: "Event not found" };
    }

    // Delete the image files from the server
    deleteImage(Event.eventImage.image);

    await Events.findByIdAndDelete(id);
    return { status: 200, message: "Event deleted successfully" };
  } catch (error) {
    console.error("Error deleting Event:", error);
    return { status: 500, message: "Error deleting Event" };
  }
};

export const updateEventById = async (id, EventsData) => {
  try {
    const result = await Events.findByIdAndUpdate(id, EventsData, {
      new: true,
      runValidators: true,
    });
    if (result) {
      return {
        status: 200,
        data: {
          data: result,
          message: "Events updated successfully",
        },
      };
    } else {
      return { status: 404, message: "Events not found" };
    }
  } catch (error) {
    console.error("Error updating Events:", error);
    return { status: 500, message: "Error updating Events" };
  }
};
export async function fetchEvents(apiKey, query, isVirtual, start) {
  const options = {
    method: "GET",
    url: "https://real-time-events-search.p.rapidapi.com/search-events",
    params: {
      query,
      isVirtual,
      start,
    },
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "real-time-events-search.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data; // Return the fetched events data
  } catch (error) {
    throw error; // Re-throw the error for handling in the route
  }
}
