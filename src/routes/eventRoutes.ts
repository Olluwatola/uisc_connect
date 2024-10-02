import { Router } from "express";
import { body, param } from "express-validator";
import validate from "../middlewares/validate";
import {
  createEvent,
  getAllEvents,
  getEventById,
  assignTicket,
} from "../controllers/event";
import authenticate from "../middlewares/authenticate";
import { handleImageUpload } from "../configs/multer";
import protect from "./../middlewares/protect";

const router: Router = Router();

// Create event (restricted access)
router.post(
  "/",
  handleImageUpload,
  protect,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("location").notEmpty().withMessage("Location is required"),
  ],
  validate,
  createEvent
);

// Get all events
router.get("/", authenticate, getAllEvents);

// Get event by ID
router.get(
  "/:id",
  authenticate,
  param("id").isMongoId(),
  validate,
  getEventById
);

// Assign ticket to event
router.post(
  "/assign-ticket",
  authenticate,
  [
    body("eventId").isMongoId().withMessage("Event ID is required"),
    body("ticketId").isMongoId().withMessage("Ticket ID is required"),
  ],
  validate,
  assignTicket
);

export default router;
