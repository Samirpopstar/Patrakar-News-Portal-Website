import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "news-portal-secret-key-2025",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Make user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use("/", routes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/", commentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT 3000`);
  console.log("Admins: Username: admin, Password: admin123");
});
