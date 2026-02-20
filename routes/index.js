import express from "express";
import {
  getAllArticles,
  getArticleById,
  getFeaturedArticles,
  getLatestArticles,
  getArticlesByCategory,
  searchArticles,
  incrementArticleViews,
} from "../models/Article.js";
import { getCommentsByArticleId } from "../models/Comment.js";
import { getAllCategories } from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const featuredArticles = await getFeaturedArticles(3);
    const latestArticles = await getLatestArticles(6);
    const categories = await getAllCategories();

    res.render("index", {
      featuredArticles,
      latestArticles,
      categories,
    });
  } catch (error) {
    console.error("Home page error:", error);
    res.status(500).send("Error loading home page");
  }
});

router.get("/article/:id", async (req, res) => {
  try {
    const article = await getArticleById(parseInt(req.params.id));

    if (article) {
      await incrementArticleViews(article.id);
      article.views++;
      const articleComments = await getCommentsByArticleId(article.id);
      const allArticles = await getAllArticles();

      res.render("article", {
        article,
        comments: articleComments,
        allArticles,
      });
    } else {
      res.status(404).render("404");
    }
  } catch (error) {
    console.error("Article page error:", error);
    res.status(500).send("Error loading article");
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const categoryArticles = await getArticlesByCategory(category);

    if (categoryArticles.length > 0) {
      res.render("category", { category, articles: categoryArticles });
    } else {
      res.status(404).render("404");
    }
  } catch (error) {
    console.error("Category page error:", error);
    res.status(500).send("Error loading category");
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const searchResults = await searchArticles(query);

    res.render("search", { query, results: searchResults });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).send("Error performing search");
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

export default router;
