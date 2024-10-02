import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { send400, send404, sendResponse } from "../handlers/responseHandlers";
import Event from "../models/Event";
import {
  combineDateAndTime,
  uploadMediaToCloudinary,
} from "./../utils/helpers";
import EventTicket from "../models/EventTicket";
import UserEventTicket from "../models/UserEventTicket";

export const getEventById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    sendResponse(res, "event fetched", event.toObject());
  }
);

export const getAllEvents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const events = await Event.find().sort({ date: 1 }); // Sort by date
    sendResponse(res, "fetched events", events);
  }
);

export const createEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, date, time, location, amountOfGuests } =
      req.body;

    // Combine date and time if both are provided
    let processedDateTime;
    if (date && time) {
      processedDateTime = combineDateAndTime(date, time);
    }
    const event = new Event({
      title,
      description,
      date: processedDateTime,
      location,
      createdBy: req.user._id, // Assuming you are using an auth middleware
      approvedAt: null,
      createdAt: new Date(),
    });

    await event.save();

    const eventTicket = new EventTicket({
      event: event.id,
      ticketType: event.title,
      quantity: amountOfGuests,
      amountAvailable: amountOfGuests,
      createdBy: req.user.id,
      description,
      createdAt: new Date(),
    });
    await eventTicket.save();

    let imageUrl: string[] = [];
    let imageThumbnailUrl: string[] = [];

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.images) {
        imageUrl = await uploadMediaToCloudinary(
          "event",
          event.id,
          files.images,
          "eventFiles"
        );
        imageThumbnailUrl = await uploadMediaToCloudinary(
          "eventThumbnail",
          event.id,
          files.images,
          "eventFiles"
        );
      }
    }
    event.imageUrl = imageUrl[0];
    event.imageThumbnailUrl = imageThumbnailUrl[0];
    await event.save();

    sendResponse(res, "new event created");
  }
);

export const assignTicket = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { eventId, ticketId } = req.body;

    const ticket = await EventTicket.findOne({ _id: ticketId, event: eventId });
    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found for this event" });
    }
    await ticket.updateOne({ amountAvailable: ticket.amountAvailable - 1 });
    const userTicket = new UserEventTicket({
      user: req.user._id, // Assuming authenticated user
      ticket: ticket._id,
    });

    await userTicket.save();
    sendResponse(res, "Ticket assigned to user", userTicket);
  }
);
