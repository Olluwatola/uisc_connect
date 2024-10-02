import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import {
  send400,
  send404,
  sendResponse,
  send409,
} from "../handlers/responseHandlers";
import Post from "../models/Post";
import Comment from "../models/Comment";

export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content, mediaUrl } = req.body;

    if (!content && !mediaUrl) {
      return send400(res, "Post content or media is required");
    }

    const post = new Post({
      user: req.user._id,
      content,
      mediaUrl,
    });

    await post.save();
    return sendResponse(res, "Post created successfully", post, 201);
  }
);

export const likePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return send404(res, "Post not found");
    }

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      return send409(res, "You have already liked this post");
    }

    post.likes.push(req.user._id);
    await post.save();

    return sendResponse(res, "Post liked successfully");
  }
);

export const repostPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return send404(res, "Post not found");
    }

    const repost = new Post({
      user: req.user._id,
      content: post.content,
      mediaUrl: post.mediaUrl,
      originalPost: post._id,
    });

    await repost.save();
    return sendResponse(res, "Post reposted successfully", repost, 201);
  }
);

export const commentOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return send400(res, "Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return send404(res, "Post not found");
    }

    const newComment = await Comment.create({
      user: req.user._id,
      post: post.id,
      comment,
    });

    return sendResponse(res, "Comment added successfully", post);
  }
);

export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await Post.findOne({ _id: postId, user: req.user._id });
    if (!post) {
      return send404(res, "Post not found");
    }

    await Post.deleteOne({ _id: postId });
    return sendResponse(res, "Post deleted successfully");
  }
);
