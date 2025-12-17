import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";

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

// Routes
app.use("/", routes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT 3000`);
  console.log("Admins: Username: admin, Password: admin123");
});
