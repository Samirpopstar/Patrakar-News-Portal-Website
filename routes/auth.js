import express from "express";

const router = express.Router();

// Register page
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null, success: null });
});

// Login page
router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

router.get("/logout", (req, res) => {
  res.redirect("/");
});

export default router;
