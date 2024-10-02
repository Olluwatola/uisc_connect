import mongoose, { Document, Schema } from "mongoose";

export interface IJobListing extends Document {
  title: string;
  description: string;
  createdBy: Schema.Types.ObjectId;
  maxResumes: number;
  createdAt: Date;
}

const JobListingSchema = new Schema<IJobListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Alumni or current student who created the job listing
  maxResumes: { type: Number, required: true, default: 10 }, // Maximum resumes that can be submitted for this job
  createdAt: { type: Date, default: new Date() },
});

const JobListing = mongoose.model<IJobListing>("JobListing", JobListingSchema);
export default JobListing;
