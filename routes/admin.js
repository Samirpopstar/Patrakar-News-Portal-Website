import express from "express";
import { articles } from "../models/Article.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", (req, res) => {
  const sortedArticles = [...articles].sort((a, b) => b.date - a.date);
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const categories = [...new Set(articles.map((a) => a.category))];

  res.render("admin/dashboard", {
    articles: sortedArticles,
    stats: {
      total: articles.length,
      categories: categories.length,
      totalViews: totalViews,
      featured: articles.filter((a) => a.featured).length,
    },
  });
});

// New article form
router.get("/articles/new", (req, res) => {
  res.render("admin/article-form", { article: null });
});

// Create article
router.post("/articles", (req, res) => {
  const { title, content, excerpt, category, image, featured } = req.body;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newArticle = {
    id: articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1,
    title,
    slug,
    content,
    excerpt: excerpt || content.substring(0, 150) + "...",
    category,
    image:
      image ||
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
    date: new Date(),
    featured: featured === "on",
    views: 0,
  };

  articles.push(newArticle);
  res.redirect("/admin/dashboard");
});

// Edit article form
router.get("/articles/:id/edit", (req, res) => {
  const article = articles.find((a) => a.id === parseInt(req.params.id));

  if (article) {
    res.render("admin/article-form", { article });
  } else {
    res.status(404).render("404");
  }
});

// Update article
router.post("/articles/:id", (req, res) => {
  const { title, content, excerpt, category, image, featured } = req.body;
  const index = articles.findIndex((a) => a.id === parseInt(req.params.id));

  if (index !== -1) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    articles[index] = {
      ...articles[index],
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      category,
      image: image || articles[index].image,
      featured: featured === "on",
    };
    res.redirect("/admin/dashboard");
  } else {
    res.status(404).render("404");
  }
});

// Delete article
router.post("/articles/:id/delete", (req, res) => {
  const index = articles.findIndex((a) => a.id === parseInt(req.params.id));

  if (index !== -1) {
    articles.splice(index, 1);
  }

  res.redirect("/admin/dashboard");
});

export default router;
