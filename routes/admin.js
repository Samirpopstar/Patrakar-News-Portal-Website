import express from "express";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  getArticleCount,
  getFeaturedArticleCount,
  getTotalViews,
} from "../models/Article.js";
import { getAllUsers, deleteUser, getUserCount } from "../models/User.js";
import { getCommentCount } from "../models/Comment.js";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  findCategoryByName,
  findCategoryById,
  getCategoryCount,
  getArticleCountByCategory,
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

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const articles = await getAllArticles();
    const totalArticles = await getArticleCount();
    const totalCategories = await getCategoryCount();
    const totalViews = await getTotalViews();
    const featuredCount = await getFeaturedArticleCount();
    const totalUsers = await getUserCount();
    const totalComments = await getCommentCount();

    res.render("admin/dashboard", {
      articles,
      stats: {
        total: totalArticles,
        categories: totalCategories,
        totalViews: totalViews,
        featured: featuredCount,
        users: totalUsers,
        comments: totalComments,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Error loading dashboard");
  }
});

router.get("/categories", requireAuth, async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.render("admin/categories", { categories, error: null, success: null });
  } catch (error) {
    console.error("Categories page error:", error);
    res.status(500).send("Error loading categories");
  }
});

router.post("/categories", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      const categories = await getAllCategories();
      return res.render("admin/categories", {
        categories,
        error: "Category name is required",
        success: null,
      });
    }

    const existing = await findCategoryByName(name);
    if (existing) {
      const categories = await getAllCategories();
      return res.render("admin/categories", {
        categories,
        error: "Category already exists",
        success: null,
      });
    }

    await createCategory(name.trim());
    const categories = await getAllCategories();
    res.render("admin/categories", {
      categories,
      error: null,
      success: "Category created successfully",
    });
  } catch (error) {
    console.error("Category creation error:", error);
    const categories = await getAllCategories();
    res.render("admin/categories", {
      categories,
      error: "Error creating category",
      success: null,
    });
  }
});

router.post("/categories/:id/delete", requireAuth, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await findCategoryById(categoryId);

    const articleCount = await getArticleCountByCategory(category.name);

    if (articleCount > 0) {
      const categories = await getAllCategories();
      return res.render("admin/categories", {
        categories,
        error: `Cannot delete category. ${articleCount} article(s) are using it.`,
        success: null,
      });
    }

    await deleteCategory(categoryId);
    res.redirect("/admin/categories");
  } catch (error) {
    console.error("Category deletion error:", error);
    res.redirect("/admin/categories");
  }
});

router.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render("admin/users", { users });
  } catch (error) {
    console.error("Users page error:", error);
    res.status(500).send("Error loading users");
  }
});

router.get("/articles/new", requireAuth, async (req, res) => {
  try {
    const categories = await getAllCategories();
    const allArticles = await getAllArticles();
    res.render("admin/article-form", {
      article: null,
      categories,
      allArticles,
    });
  } catch (error) {
    console.error("New article page error:", error);
    res.status(500).send("Error loading form");
  }
});

// router.post(
//   "/upload-image",
//   requireAuth,
//   uploadCKEditorImage.single("upload"),
//   (req, res) => {
//     if (req.file) {
//       const imageUrl = `/uploads/ckeditor/${req.file.filename}`;
//       res.json({
//         uploaded: true,
//         url: imageUrl,
//       });
//     } else {
//       res.json({
//         uploaded: false,
//         error: {
//           message: "Upload failed",
//         },
//       });
//     }
//   }
// );

router.post(
  "/articles",
  requireAuth,
  uploadArticleImage.single("image"),
  async (req, res) => {
    try {
      const { title, content, excerpt, category, featured } = req.body;

      if (!title || !content || !category) {
        return res
          .status(400)
          .send("Title, content, and category are required");
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const imagePath = req.file
        ? `/uploads/articles/${req.file.filename}`
        : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80";

      const newArticleData = {
        title,
        slug,
        content,
        excerpt:
          excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
        category,
        image: imagePath,
        author: req.session.user.username,
        featured: featured === "on",
      };

      await createArticle(newArticleData);
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).send("Error creating article: " + error.message);
    }
  },
);

router.get("/articles/:id/edit", requireAuth, async (req, res) => {
  try {
    const article = await getArticleById(parseInt(req.params.id));

    if (article) {
      const categories = await getAllCategories();
      const allArticles = await getAllArticles();
      res.render("admin/article-form", { article, categories, allArticles });
    } else {
      res.status(404).render("404");
    }
  } catch (error) {
    console.error("Edit article page error:", error);
    res.status(500).send("Error loading article");
  }
});

router.post(
  "/articles/:id",
  requireAuth,
  uploadArticleImage.single("image"),
  async (req, res) => {
    try {
      const { title, content, excerpt, category, featured } = req.body;
      const articleId = parseInt(req.params.id);
      const article = await getArticleById(articleId);

      if (!article) {
        return res.status(404).render("404");
      }

      if (!title || !content || !category) {
        return res
          .status(400)
          .send("Title, content, and category are required");
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

      await updateArticle(articleId, updatedData);
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).send("Error updating article: " + error.message);
    }
  },
);

router.post("/articles/:id/delete", requireAuth, async (req, res) => {
  try {
    await deleteArticle(parseInt(req.params.id));
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Article deletion error:", error);
    res.redirect("/admin/dashboard");
  }
});

export default router;
