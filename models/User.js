import pool from "../config/database.js";

export async function createUser(username, email, password) {
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password, "user"]
  );
  return result.insertId;
}

export async function findUserByUsername(username) {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return rows[0];
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

export async function findUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

export async function getAllUsers() {
  const [rows] = await pool.query(
    "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC"
  );
  return rows;
}

export async function deleteUser(id) {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function getUserCount() {
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM users");
  return rows[0].count;
}
