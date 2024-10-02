import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string;
  imageThumbnailUrl: string;
  createdBy: Schema.Types.ObjectId;
  approvedAt: Date;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  imageThumbnailUrl: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user who created it
  approvedAt: { type: Date },
  createdAt: { type: Date },
});

EventSchema.plugin(mongoosePaginate);

const Event = mongoose.model<IEvent, mongoose.PaginateModel<IEvent>>(
  "Event",
  EventSchema
);
export default Event;
