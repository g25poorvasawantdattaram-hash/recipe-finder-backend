// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes"); // if you have this

const app = express();

// --- middleware ---
app.use(cors());
app.use(express.json());

// --- DB connect ---
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB (Atlas) connected");
  } catch (e) {
    console.error("❌ MongoDB connect error:", e.message);
    process.exit(1);
  }
})();

// --- sanity routes ---
app.get("/", (_req, res) => res.send("API is running..."));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes); // remove if you’re defining inline routes

// (optional) 404 catcher AFTER all routes
app.use((req, res) => {

  console.log("404 ->", req.method, req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
