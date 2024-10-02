import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: Schema.Types.ObjectId;
  content: string;
  mediaUrl?: string;
  likes: Schema.Types.ObjectId[];
  repost?: Schema.Types.ObjectId;
  
  createdAt: Date;
}

const PostSchema: Schema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  content: { type: String, required: true }, // The content of the post
  mediaUrl: { type: String, default: null }, // Optional media (images, videos, etc.)
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of users who liked the post
  repost: { type: Schema.Types.ObjectId, ref: "Post", default: null }, // If it's a repost, reference the original post
  
  createdAt: { type: Date, default: Date.now }, // Timestamp for the post creation
});

// Index for efficient querying of reposts, likes, and comments
PostSchema.index({ user: 1, createdAt: -1 });

// Export the model
const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
