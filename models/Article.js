import pool from "../config/database.js";

export async function createArticle(articleData) {
  const { title, slug, content, excerpt, category, image, author, featured } =
    articleData;
  const [result] = await pool.query(
    "INSERT INTO articles (title, slug, content, excerpt, category, image, author, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [title, slug, content, excerpt, category, image, author, featured ? 1 : 0]
  );
  return result.insertId;
}

export async function updateArticle(id, articleData) {
  const { title, slug, content, excerpt, category, image, featured } =
    articleData;
  const [result] = await pool.query(
    "UPDATE articles SET title = ?, slug = ?, content = ?, excerpt = ?, category = ?, image = ?, featured = ? WHERE id = ?",
    [title, slug, content, excerpt, category, image, featured ? 1 : 0, id]
  );
  return result.affectedRows > 0;
}

export async function deleteArticle(id) {
  const [result] = await pool.query("DELETE FROM articles WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function getAllArticles() {
  const [rows] = await pool.query(
    "SELECT * FROM articles ORDER BY created_at DESC"
  );
  return rows;
}

export async function getArticleById(id) {
  const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);
  return rows[0];
}

export async function getArticlesByCategory(category) {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE category = ? ORDER BY created_at DESC",
    [category]
  );
  return rows;
}

export async function getFeaturedArticles(limit = 3) {
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE featured = 1 ORDER BY created_at DESC LIMIT ?",
    [limit]
  );
  return rows;
}

export async function getLatestArticles(limit = 6) {
  const [rows] = await pool.query(
    "SELECT * FROM articles ORDER BY created_at DESC LIMIT ?",
    [limit]
  );
  return rows;
}

export async function searchArticles(query) {
  const searchTerm = `%${query}%`;
  const [rows] = await pool.query(
    "SELECT * FROM articles WHERE title LIKE ? OR content LIKE ? OR category LIKE ? ORDER BY created_at DESC",
    [searchTerm, searchTerm, searchTerm]
  );
  return rows;
}

export async function incrementArticleViews(id) {
  await pool.query("UPDATE articles SET views = views + 1 WHERE id = ?", [id]);
}

export async function getArticleCount() {
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM articles");
  return rows[0].count;
}

export async function getFeaturedArticleCount() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM articles WHERE featured = 1"
  );
  return rows[0].count;
}

export async function getTotalViews() {
  const [rows] = await pool.query("SELECT SUM(views) as total FROM articles");
  return rows[0].total || 0;
}
