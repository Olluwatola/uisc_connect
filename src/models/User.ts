import mongoose, { Schema, model, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import bcrypt from "bcryptjs";
import RoleType from "../enums/RoleType";

// Interface for User Document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  role: string;
  graduatedInYear?: number;
  matricNo: string;
  educationLevel?: string;
  emailAddress: string;
  yearOfAdmission?: number;
  profilePicture?: string;
  profilePictureThumbnail?: string;
  verifiedAt: Date;
  suspendedAt: Date;
  deletedAt: Date;
  passwordLastChanged?: Date;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true, enum: RoleType, default: RoleType.A },
    graduatedInYear: { type: Number },
    matricNo: {
      type: String,
      //required: true,
      unique: true,
    },
    educationLevel: {
      type: String,
      //   required: function () {
      //     return !this.graduatedInYear;
      //   },
    },
    emailAddress: { type: String, required: true, unique: true },
    yearOfAdmission: {
      type: Number,
      //required: true
    },
    profilePicture: { type: String },
    profilePictureThumbnail: {
      type: String,
    },
    verifiedAt: { type: Date },
    suspendedAt: { type: Date },
    deletedAt: { type: Date },
    passwordLastChanged: { type: Date },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model<IUser, mongoose.PaginateModel<IUser>>(
  "User",
  UserSchema
);

export default User;
