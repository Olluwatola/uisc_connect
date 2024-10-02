import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  user: Schema.Types.ObjectId;
  fileUrl: string;
  createdAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true }, // URL of the resume file (stored on cloud)
  createdAt: { type: Date, default: new Date() },
});

const Resume = mongoose.model<IResume>("Resume", ResumeSchema);
export default Resume;
