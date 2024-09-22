import { v2 as cloudinary } from "cloudinary";
import {
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} from "./../utils/constants";


cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export default cloudinary;
