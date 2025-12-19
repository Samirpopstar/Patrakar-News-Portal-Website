import express from "express";
import {
  comments,
  createComment,
  getCommentsByArticleId,
  deleteComment,
} from "../models/Comment.js";

const router = express.Router();

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

// Post comment
router.post("/article/:id/comment", requireAuth, (req, res) => {
  const articleId = parseInt(req.params.id);
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.redirect(`/article/${articleId}`);
  }

  createComment(
    articleId,
    req.session.user.id,
    req.session.user.username,
    content.trim()
  );

  res.redirect(`/article/${articleId}`);
});

// Delete comment (user can delete their own, admin can delete any)
router.post("/comment/:id/delete", requireAuth, (req, res) => {
  const commentId = parseInt(req.params.id);
  const { articleId } = req.body;

  const comment = comments.find((c) => c.id === commentId);

  // Check if user owns the comment or is admin
  if (
    comment &&
    (comment.userId === req.session.user.id ||
      req.session.user.role === "admin")
  ) {
    deleteComment(commentId);
  }

  res.redirect(`/article/${articleId}`);
});

export default router;
