import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  comment: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema<IComment>({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // Reference to the post
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who made the comment
  comment: { type: String, required: true }, // Comment content
  createdAt: { type: Date, default: Date.now }, // Timestamp for the comment creation
});

// Index for efficient querying of comments by post and user
CommentSchema.index({ post: 1, createdAt: -1 });

// Export the model
const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
