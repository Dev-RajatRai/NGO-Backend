import axios from "axios";
import Events from "../Models/Events.js";

export const getAllEvents = async () => {
  try {
    const Eventss = await Events.find();
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
      message: "Event created successfully",
      data: savedEvents,
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
    const result = await Events.findByIdAndDelete(id);
    if (result) {
      return { status: 200, message: "Events deleted successfully" };
    } else {
      return { status: 404, message: "Events not found" };
    }
  } catch (error) {
    console.error("Error deleting Events:", error);
    return { status: 500, message: "Error deleting Events" };
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
        data: result,
        message: "Events updated successfully",
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
