import pool from "./database.js";

async function setupDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();

    console.log("Setting up database tables...");

    // Create Categories Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Articles Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category VARCHAR(255) NOT NULL,
        image VARCHAR(500),
        author VARCHAR(255) NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Comments Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        username VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Insert default admin user if not exists
    const [adminCheck] = await connection.query(
      "SELECT id FROM users WHERE username = ?",
      ["admin"]
    );

    if (adminCheck.length === 0) {
      await connection.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        ["admin", "admin@newsportal.com", "admin123", "admin"]
      );
    }

    // Insert default categories if not exist
    const defaultCategories = [
      { name: "Technology", slug: "technology" },
      { name: "Business", slug: "business" },
      { name: "Sports", slug: "sports" },
      { name: "Science", slug: "science" },
      { name: "Environment", slug: "environment" },
      { name: "Health", slug: "health" },
    ];

    for (const cat of defaultCategories) {
      const [catCheck] = await connection.query(
        "SELECT id FROM categories WHERE slug = ?",
        [cat.slug]
      );
      if (catCheck.length === 0) {
        await connection.query(
          "INSERT INTO categories (name, slug) VALUES (?, ?)",
          [cat.name, cat.slug]
        );
      }
    }

    // Insert sample articles if none exist
    const [articleCount] = await connection.query(
      "SELECT COUNT(*) as count FROM articles"
    );
    if (articleCount[0].count === 0) {
      const sampleArticles = [
        {
          title: "Artificial Intelligence Transforms Healthcare Industry",
          slug: "ai-transforms-healthcare",
          content:
            "<p>Revolutionary AI systems are now assisting doctors in diagnosing diseases with unprecedented accuracy. Machine learning algorithms analyze medical images, predict patient outcomes, and suggest personalized treatment plans.</p><p>Major hospitals worldwide are adopting these technologies, marking a new era in medical practice.</p>",
          excerpt:
            "AI systems are revolutionizing medical diagnosis and treatment planning across hospitals worldwide.",
          category: "Technology",
          image: "/uploads/tech.jpeg",
          author: "admin",
          featured: true,
        },
        {
          title: "Renewable Energy Surpasses Fossil Fuels in Global Markets",
          slug: "renewable-energy-milestone",
          content:
            "<p>For the first time in history, renewable energy sources have generated more electricity than fossil fuels in major economies.</p><p>Solar and wind power installations have reached record levels, driven by falling costs and government incentives.</p>",
          excerpt:
            "Solar and wind power generation exceeds fossil fuels for the first time in history.",
          category: "Environment",
          image: "/uploads/energy.jpg",
          author: "admin",
          featured: true,
        },
        {
          title: "Olympic Champion Breaks 20-Year-Old World Record",
          slug: "olympic-world-record",
          content:
            "<p>In a stunning display of athletic prowess, the championship witnessed a historic moment as a new world record was set.</p><p>The achievement came during the final moments of the competition.</p>",
          excerpt:
            "Historic athletic achievement shatters long-standing world record.",
          category: "Sports",
          image: "/uploads/olympics.jpg",
          author: "admin",
          featured: false,
        },
        {
          title: "Mars Rover Sends Back Stunning Photos of Martian Surface",
          slug: "mars-rover-photos",
          content:
            "<p>The latest images from the Mars Rover reveal unprecedented details of the red planet’s terrain, including rocky landscapes, valleys, and evidence of ancient water channels.</p>",
          excerpt: "NASA shares breathtaking photos captured by Mars Rover.",
          category: "Science",
          image: "/uploads/mars.jpg",
          author: "admin",
          featured: false,
        },
        {
          title: "Breakthrough in Cancer Research Offers New Hope",
          slug: "cancer-research-breakthrough",
          content:
            "<p>Researchers have discovered a promising new therapy that targets cancer cells more precisely, reducing side effects and improving treatment outcomes.</p>",
          excerpt:
            "Innovative cancer therapy shows promising results in clinical trials.",
          category: "Health",
          image: "/uploads/cancer.jpg",
          author: "admin",
          featured: true,
        },
      ];

      for (const article of sampleArticles) {
        await connection.query(
          "INSERT INTO articles (title, slug, content, excerpt, category, image, author, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            article.title,
            article.slug,
            article.content,
            article.excerpt,
            article.category,
            article.image,
            article.author,
            article.featured,
          ]
        );
      }
      console.log("✅ Sample articles created");
    }

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Database setup error:", error);
  } finally {
    if (connection) connection.release();
  }
}

export default setupDatabase;
