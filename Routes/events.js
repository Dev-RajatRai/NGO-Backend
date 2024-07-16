import express from "express";
import multer from "multer";
import {
  createMultipleEvents,
  deleteEventsById,
  fetchEvents,
  getAllEvents,
  getCurrentEvents,
  getPreviousEvents,
  getUpcomingEvents,
  searchEventById,
  searchEventssByTitle,
  updateEventById,
} from "../Controllers/Events.js";
import Events from "../Models/Events.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isAdmin, isLoggedIn } from "../Middleware/index.js";
const routes = express.Router();

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadFolder = () => {
  const folderPath = path.join(
    path.resolve(__dirname, "../"),
    "public",
    "events"
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Create the upload folder before setting up Multer
createUploadFolder();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../", "public", "events"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Get All events
routes.get("/get-all-events", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const val = await getAllEvents(parseInt(page), parseInt(limit));
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Get Upcoming events
routes.get("/get-upcoming-events", async (req, res) => {
  try {
    const val = await getUpcomingEvents();
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Get Current events
routes.get("/get-current-events", async (req, res) => {
  try {
    const val = await getCurrentEvents();
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Get Previous events
routes.get("/get-previous-events", async (req, res) => {
  try {
    const val = await getPreviousEvents();
    res.status(val.status).send(val);
  } catch (error) {
    res.status(error.status || 500).send({ message: error.message });
  }
});
// Create a new event
routes.post(
  "/create-event",
  upload.any([{ name: "eventImage", maxCount: 1 }]),
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const {
        title,
        description,
        city,
        state,
        country,
        zipcode,
        startDate,
        endDate,
        organizer,
        category,
      } = req.body;

      // Check for missing fields
      const requiredFields = {
        title,
        description,
        city,
        state,
        country,
        zipcode,
        startDate,
        endDate,
        organizer,
        category,
      };
      const missingFields = Object.keys(requiredFields).filter(
        (key) => !requiredFields[key]
      );
      if (missingFields.length > 0) {
        return res.status(400).send({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      const eventImage = req.file ? req.file?.[0]?.filename : null;

      const eventData = {
        title,
        description,
        location: {
          city,
          state,
          country,
          zipcode,
        },
        eventImage: {
          image: req.files?.[0]?.filename,
        },
        startDate,
        endDate,
        organizer,
        category,
      };
      const newEvent = new Events(eventData);
      const savedEvent = await newEvent.save();

      res
        .status(201)
        .json({ message: "Event created successfully", data: savedEvent });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(error.status || 500).send({ message: error.message });
    }
  }
);

// Add multiple events
routes.post("/create-multiple-events", async (req, res) => {
  try {
    const eventData = req.body;
    const response = await createMultipleEvents(eventData);
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Search events
routes.get("/search-event", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(400)
        .send({ message: "Title query parameter is required" });
    }
    const response = await searchEventssByTitle(title);
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Delete Event by ID
routes.delete("/delete-event/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteEventsById(id);
    res.status(response.status).send({ message: response.message });
  } catch (error) {
    res
      .status(error.status || 500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// Update Event by ID
routes.put(
  "/update-event/:id",
  upload.any([{ name: "eventImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        city,
        state,
        country,
        zipcode,
        startDate,
        endDate,
        organizer,
        category,
      } = req.body;

      const updates = {
        title,
        description,
        location: {
          city,
          state,
          country,
          zipcode,
        },
        startDate,
        endDate,
        organizer,
        category,
      };

      const response = await updateEventById(id, updates);
      res
        .status(response.status)
        .send({ message: response.message, data: response.data });
    } catch (error) {
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);
routes.get("/get-event/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await searchEventById(id);
    if (!event) {
      return res.status(404).send({ message: "event not found" });
    }
    res.status(200).send(event);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "Internal Server Error",
    });
  }
});
// Fetch events
// routes.get("/events", async (req, res) => {
//   try {
//     const apiKey = process.env.RAPID_API_KEY; // Use environment variable for security
//     if (!apiKey) {
//       return res.status(401).json({ message: "Missing API key" });
//     }

//     const query = req.query.query || "holidays in india"; // Handle optional query parameter
//     const isVirtual = req.query.is_virtual === "true"; // Convert boolean query parameter
//     const start = req.query.start || "0"; // Handle optional start parameter

//     const events = await fetchEvents(apiKey, query, isVirtual, start);
//     res.json(events); // Send fetched events data
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching events" }); // Handle errors gracefully
//   }
// });

export default routes;
