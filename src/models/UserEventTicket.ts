import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IUserEventTicket extends Document {
  displayableTicketId: string;
  user: Schema.Types.ObjectId;
  ticket: Schema.Types.ObjectId;
  assignedAt: Date;
}

const UserEventTicketSchema = new Schema<IUserEventTicket>({
  displayableTicketId: {
    type: String,
    required: true,
    default: () => {
      // Make sure randomInt is defined or imported from a library like 'crypto'
      return (
        "tk" +
        (Math.floor(Math.random() * (99 - 10 + 1)) + 10).toString() +
        Date.now().toString()
      );
    },
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ticket: { type: Schema.Types.ObjectId, ref: "EventTicket", required: true },
  assignedAt: { type: Date },
});

UserEventTicketSchema.plugin(mongoosePaginate);

const UserEventTicket = mongoose.model<
  IUserEventTicket,
  mongoose.PaginateModel<IUserEventTicket>
>("UserEventTicket", UserEventTicketSchema);
export default UserEventTicket;
