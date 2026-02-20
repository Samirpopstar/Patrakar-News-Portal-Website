import express from "express";
import {
  createUser,
  findUserByUsername,
  findUserByEmail,
} from "../models/User.js";

const router = express.Router();

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/register", { error: null, success: null });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

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

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return res.render("auth/register", {
        error: "Username already exists",
        success: null,
      });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.render("auth/register", {
        error: "Email already exists",
        success: null,
      });
    }

    await createUser(username, email, password);

    res.render("auth/register", {
      error: null,
      success: "Registration successful! You can now login.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.render("auth/register", {
      error: "An error occurred during registration",
      success: null,
    });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/login", { error: null });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (user && user.password === password) {
      req.session.user = user;

      if (user.role === "admin") {
        res.redirect("/admin/dashboard");
      } else {
        res.redirect("/");
      }
    } else {
      res.render("auth/login", { error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.render("auth/login", { error: "An error occurred during login" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

export default router;
