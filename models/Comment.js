import pool from "../config/database.js";

export async function createComment(articleId, userId, username, content) {
  const [result] = await pool.query(
    "INSERT INTO comments (article_id, user_id, username, content) VALUES (?, ?, ?, ?)",
    [articleId, userId, username, content]
  );
  return result.insertId;
}

export async function getCommentsByArticleId(articleId) {
  const [rows] = await pool.query(
    "SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC",
    [articleId]
  );
  return rows;
}

export async function deleteComment(id) {
  const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function getCommentById(id) {
  const [rows] = await pool.query("SELECT * FROM comments WHERE id = ?", [id]);
  return rows[0];
}

export async function getCommentCount() {
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM comments");
  return rows[0].count;
}
