import mongoose, { Document, Schema } from "mongoose";
import OTPType from "../enums/OTPType";

export interface IOTP extends Document {
  user: Schema.Types.ObjectId;
  code: String;
  type: String;
  expiration: Date;
  usedAt?: Date ;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: {
    type: String,
    minlength: 6,
    maxlength: 6,
    required: true,
  },
  type: {
    type: String,
    enum: OTPType,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
  },
  usedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const OTP = mongoose.model<IOTP>("OTP", OTPSchema);

export default OTP;
