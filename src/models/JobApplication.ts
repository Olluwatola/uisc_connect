import mongoose, { Document, Schema } from "mongoose";

export interface IJobApplication extends Document {
  user: Schema.Types.ObjectId;
  jobListing: Schema.Types.ObjectId;
  resume: Schema.Types.ObjectId;
  submittedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobListing: {
    type: Schema.Types.ObjectId,
    ref: "JobListing",
    required: true,
  },
  resume: { type: Schema.Types.ObjectId, ref: "Resume", required: true },
  submittedAt: { type: Date, default: new Date() },
});

const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema
);
export default JobApplication;
