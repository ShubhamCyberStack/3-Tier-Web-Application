const express = require("express");
require("dotenv").config();
const cors = require("cors");
const initializeDatabase = require("./config/db");

const app = express();
app.use(express.json());

// ====================
// Origins & CORS setup
// ====================
const allowedOrigins =
  process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim())
    : ["http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed by Book Review API"));
    }
  },
  credentials: true,
}));

// ==============
// Logging helper
// ==============
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || "unknown"}`
  );
  next();
});

async function startServer() {
  try {
    // =========================
    // Database initialization
    // =========================
    const sequelize = await initializeDatabase();

    // Models load
    const User = require("./models/User")(sequelize);
    const Book = require("./models/Book")(sequelize);
    const Review = require("./models/Review")(sequelize);

    // Sync in correct order
    await User.sync({ alter: true });
    await Book.sync({ alter: true });
    await Review.sync({ alter: true });
    console.log("✅ Database schema updated successfully!");

    // ================ 
    // Initial seed data for demo/dev only (remove for pure prod)
    // ================
    if (await User.count() === 0) {
      await User.bulkCreate([
        { name: "John Doe", email: "john@example.com", password: "hashedpassword123" },
        { name: "Alice Smith", email: "alice@example.com", password: "hashedpassword456" }
      ]);
      console.log("👤 Sample users added!");
    }
    if (await Book.count() === 0) {
      await Book.bulkCreate([
        { title: "The Pragmatic Programmer", author: "Andrew Hunt", rating: 4.8 },
        { title: "Clean Code", author: "Robert C. Martin", rating: 4.7 },
        { title: "JavaScript: The Good Parts", author: "Douglas Crockford", rating: 4.5 },
      ]);
      console.log("📚 Sample books added!");
    }
    if (await Review.count() === 0) {
      await Review.bulkCreate([
        { userId: 1, bookId: 1, comment: "Fantastic book!", rating: 5, username: "John Doe" },
        { userId: 2, bookId: 2, comment: "Very insightful.", rating: 4, username: "Alice Smith" },
      ]);
      console.log("✍️ Sample reviews added!");
    }

    // ================
    // API Routes
    // ================
    app.use("/api/users", require("./routes/userRoutes")(sequelize));
    app.use("/api/books", require("./routes/bookRoutes")(sequelize));
    app.use("/api/reviews", require("./routes/reviewRoutes")(sequelize));

    // ================
    // Health check
    // ================
    app.get("/", (req, res) =>
      res.status(200).send("📚 Book Review API is running...")
    );

    // For Internal ALB health check - returns 200 if DB and API are up
    app.get("/health", async (req, res) => {
      try {
        await sequelize.authenticate();
        res.status(200).json({ status: "ok" });
      } catch (err) {
        res.status(500).json({ status: "fail", error: err.message });
      }
    });

    // ======================
    // Start server on PORT 
    // ======================
    const PORT = process.env.PORT || 3001; // <--- default to 3001 per AWS 3-tier common patterns
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1); // Ensure container/pm2/etc knows about fatal startup errors
  }
}

// Start the server
startServer();
