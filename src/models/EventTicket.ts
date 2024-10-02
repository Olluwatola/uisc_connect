import mongoose, { Document, Schema } from "mongoose";

export interface IEventTicket extends Document {
  event: Schema.Types.ObjectId;
  ticketType: string;
  quantity: number;
  amountAvailable: number;
  createdBy: Schema.Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventTicketSchema = new Schema<IEventTicket>({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  ticketType: { type: String, required: true }, // Example: 'General', 'VIP'
  quantity: { type: Number, required: true },
  amountAvailable: {
    type: Number,
    required: true,
    default: function () {
      return this.quantity;
    },
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

const EventTicket = mongoose.model<IEventTicket>(
  "EventTicket",
  EventTicketSchema
);
export default EventTicket;
