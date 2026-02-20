import express from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
} from "../models/Comment.js";

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

router.post("/article/:id/comment", requireAuth, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.redirect(`/article/${articleId}`);
    }

    await createComment(
      articleId,
      req.session.user.id,
      req.session.user.username,
      content.trim()
    );

    res.redirect(`/article/${articleId}`);
  } catch (error) {
    console.error("Comment creation error:", error);
    res.redirect(`/article/${req.params.id}`);
  }
});

export default router;
