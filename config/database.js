import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "messi@123",
  database: "newsPortalDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("MySQL connection error:", error.message);
    console.error(
      'Make sure MySQL is running and database "newsPortalDB" exists'
    );
  }
}

const [rows] = await pool.query("SELECT NOW()");
console.log(rows);

testConnection();

export default pool;
