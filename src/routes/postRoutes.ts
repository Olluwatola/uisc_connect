import { Router } from "express";
import { body, param } from "express-validator";
import validate from "../middlewares/validate";
import authenticate from "../middlewares/authenticate";
import {
  createPost,
  likePost,
  repostPost,
  commentOnPost,
  deletePost,
} from "../controllers/postController";

const router = Router();

// Create a post
router.post(
  "/",
  authenticate,
  [
    body("content", "Content is optional but must be a string")
      .optional()
      .isString(),
    body("mediaUrl", "Media URL must be a valid URL").optional().isURL(),
  ],
  validate,
  createPost
);

// Like a post
router.post(
  "/:postId/like",
  authenticate,
  [param("postId", "Invalid post ID").isMongoId()],
  validate,
  likePost
);

// Repost a post
router.post(
  "/:postId/repost",
  authenticate,
  [param("postId", "Invalid post ID").isMongoId()],
  validate,
  repostPost
);

// Comment on a post
router.post(
  "/:postId/comment",
  authenticate,
  [
    param("postId", "Invalid post ID").isMongoId(),
    body("comment", "Comment is required").notEmpty().isString(),
  ],
  validate,
  commentOnPost
);

// Delete a post
router.delete(
  "/:postId",
  authenticate,
  [param("postId", "Invalid post ID").isMongoId()],
  validate,
  deletePost
);

export default router;
