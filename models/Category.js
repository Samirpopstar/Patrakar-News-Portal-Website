import pool from "../config/database.js";

export async function createCategory(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const [result] = await pool.query(
    "INSERT INTO categories (name, slug) VALUES (?, ?)",
    [name, slug]
  );
  return result.insertId;
}

export async function getAllCategories() {
  const [rows] = await pool.query(
    "SELECT * FROM categories ORDER BY created_at DESC"
  );
  return rows;
}

export async function findCategoryByName(name) {
  const [rows] = await pool.query("SELECT * FROM categories WHERE name = ?", [
    name,
  ]);
  return rows[0];
}

export async function findCategoryById(id) {
  const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
    id,
  ]);
  return rows[0];
}

export async function deleteCategory(id) {
  const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}

export async function getCategoryCount() {
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM categories");
  return rows[0].count;
}

export async function getArticleCountByCategory(categoryName) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM articles WHERE category = ?",
    [categoryName]
  );
  return rows[0].count;
}
