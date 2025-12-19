import express from "express";
import { articles } from "../models/Article.js";
import { getCommentsByArticleId } from "../models/Comment.js";

const router = express.Router();

// Home page
router.get("/", (req, res) => {
  const sortedArticles = [...articles].sort((a, b) => b.date - a.date);
  const featuredArticles = sortedArticles.filter((a) => a.featured).slice(0, 3);
  const latestArticles = sortedArticles.slice(0, 6);
  const categories = [...new Set(articles.map((a) => a.category))];

  res.render("index", {
    featuredArticles,
    latestArticles,
    categories,
  });
});

// Single article page (UPDATED WITH COMMENTS)
router.get("/article/:id", (req, res) => {
  const article = articles.find((a) => a.id === parseInt(req.params.id));

  if (article) {
    article.views++;
    const relatedArticles = articles
      .filter((a) => a.category === article.category && a.id !== article.id)
      .slice(0, 3);

    // Get comments for this article
    const articleComments = getCommentsByArticleId(article.id);

    res.render("article", {
      article,
      relatedArticles,
      comments: articleComments,
    });
  } else {
    res.status(404).render("404");
  }
});

// Category page
router.get("/category/:category", (req, res) => {
  const category = req.params.category;
  const categoryArticles = articles
    .filter((a) => a.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => b.date - a.date);

  if (categoryArticles.length > 0) {
    res.render("category", { category, articles: categoryArticles });
  } else {
    res.status(404).render("404");
  }
});

// Search
router.get("/search", (req, res) => {
  const query = req.query.q || "";
  const searchResults = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.content.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  res.render("search", { query, results: searchResults });
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

export default router;
