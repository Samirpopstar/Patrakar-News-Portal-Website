import express from "express";
import {
  users,
  createUser,
  findUserByUsername,
  findUserByEmail,
} from "../models/User.js";

const router = express.Router();

// Register page
router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/register", { error: null, success: null });
});

// Register handler
router.post("/register", (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    return res.render("auth/register", {
      error: "All fields are required",
      success: null,
    });
  }

  if (password !== confirmPassword) {
    return res.render("auth/register", {
      error: "Passwords do not match",
      success: null,
    });
  }

  if (password.length < 6) {
    return res.render("auth/register", {
      error: "Password must be at least 6 characters",
      success: null,
    });
  }

  // Check if username exists
  if (findUserByUsername(username)) {
    return res.render("auth/register", {
      error: "Username already exists",
      success: null,
    });
  }

  // Check if email exists
  if (findUserByEmail(email)) {
    return res.render("auth/register", {
      error: "Email already exists",
      success: null,
    });
  }

  // Create user
  createUser(username, email, password);

  res.render("auth/register", {
    error: null,
    success: "Registration successful! You can now login.",
  });
});

// Login page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/login", { error: null });
});

// Login handler
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.user = user;

    // Redirect admin to dashboard, regular users to home
    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/");
    }
  } else {
    res.render("auth/login", { error: "Invalid username or password" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

export default router;
