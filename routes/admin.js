import express from "express";
import {
  articles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../models/Article.js";
import { users as allUsers, deleteUser } from "../models/User.js";
import { comments } from "../models/Comment.js";
import {
  categories,
  createCategory,
  deleteCategory,
  findCategoryByName,
} from "../models/Category.js";
import { uploadArticleImage, uploadCKEditorImage } from "../config/multer.js";

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

// Dashboard
router.get("/dashboard", requireAuth, (req, res) => {
  const sortedArticles = [...articles].sort((a, b) => b.date - a.date);
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  res.render("admin/dashboard", {
    articles: sortedArticles,
    stats: {
      total: articles.length,
      categories: categories.length,
      totalViews: totalViews,
      featured: articles.filter((a) => a.featured).length,
      users: allUsers.length,
      comments: comments.length,
    },
  });
});

// Categories Management
router.get("/categories", requireAuth, (req, res) => {
  const sortedCategories = [...categories].sort(
    (a, b) => b.createdAt - a.createdAt
  );
  res.render("admin/categories", {
    categories: sortedCategories,
    error: null,
    success: null,
  });
});

// Create category
router.post("/categories", requireAuth, (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    const sortedCategories = [...categories].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return res.render("admin/categories", {
      categories: sortedCategories,
      error: "Category name is required",
      success: null,
    });
  }

  if (findCategoryByName(name)) {
    const sortedCategories = [...categories].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return res.render("admin/categories", {
      categories: sortedCategories,
      error: "Category already exists",
      success: null,
    });
  }

  createCategory(name.trim());
  const sortedCategories = [...categories].sort(
    (a, b) => b.createdAt - a.createdAt
  );
  res.render("admin/categories", {
    categories: sortedCategories,
    error: null,
    success: "Category created successfully",
  });
});

// Delete category
router.post("/categories/:id/delete", requireAuth, (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categories.find((c) => c.id === categoryId);

  // Check if any articles use this category
  const articlesWithCategory = articles.filter(
    (a) => a.category === category?.name
  );

  if (articlesWithCategory.length > 0) {
    const sortedCategories = [...categories].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    return res.render("admin/categories", {
      categories: sortedCategories,
      error: `Cannot delete category. ${articlesWithCategory.length} article(s) are using it.`,
      success: null,
    });
  }

  deleteCategory(categoryId);
  res.redirect("/admin/categories");
});

// Users management
router.get("/users", requireAuth, (req, res) => {
  const sortedUsers = [...allUsers].sort((a, b) => b.createdAt - a.createdAt);
  res.render("admin/users", { users: sortedUsers });
});

// Delete user
router.post("/users/:id/delete", requireAuth, (req, res) => {
  const userId = parseInt(req.params.id);

  if (userId === req.session.user.id) {
    return res.redirect("/admin/users");
  }

  deleteUser(userId);
  res.redirect("/admin/users");
});

// New article form
router.get("/articles/new", requireAuth, (req, res) => {
  res.render("admin/article-form", {
    article: null,
    categories,
    allArticles: articles,
  });
});

// CKEditor image upload endpoint
router.post(
  "/upload-image",
  requireAuth,
  uploadCKEditorImage.single("upload"),
  (req, res) => {
    if (req.file) {
      const imageUrl = `/uploads/ckeditor/${req.file.filename}`;
      res.json({
        uploaded: true,
        url: imageUrl,
      });
    } else {
      res.json({
        uploaded: false,
        error: {
          message: "Upload failed",
        },
      });
    }
  }
);

// Create article with image upload
router.post(
  "/articles",
  requireAuth,
  uploadArticleImage.fields([{ name: "image", maxCount: 1 }]),
  (req, res) => {
    const { title, content, excerpt, category, featured } = req.body;

    const imagePath = req.files?.image
      ? `/uploads/articles/${req.files.image[0].filename}`
      : "/uploads/default.jpg";

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    createArticle({
      title,
      slug,
      content,
      excerpt:
        excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
      category,
      image: imagePath,
      author: req.session.user.username,
      featured: featured === "on",
    });

    res.redirect("/admin/dashboard");
  }
);

// Edit article form
router.get("/articles/:id/edit", requireAuth, (req, res) => {
  const article = articles.find((a) => a.id === parseInt(req.params.id));

  if (article) {
    res.render("admin/article-form", {
      article,
      categories,
      allArticles: articles,
    });
  } else {
    res.status(404).render("404");
  }
});

// Update article with image upload
router.post(
  "/articles/:id",
  requireAuth,
  uploadArticleImage.single("image"),
  (req, res) => {
    const { title, content, excerpt, category, featured } = req.body;
    const articleId = parseInt(req.params.id);
    const article = articles.find((a) => a.id === articleId);

    if (!article) {
      return res.status(404).render("404");
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const imagePath = req.file
      ? `/uploads/articles/${req.file.filename}`
      : article.image;

    const updatedData = {
      title,
      slug,
      content,
      excerpt:
        excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
      category,
      image: imagePath,
      featured: featured === "on",
    };

    updateArticle(articleId, updatedData);
    res.redirect("/admin/dashboard");
  }
);

// Delete article
router.post("/articles/:id/delete", requireAuth, (req, res) => {
  deleteArticle(parseInt(req.params.id));
  res.redirect("/admin/dashboard");
});

export default router;
