const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  console.error("API request failed:", error);
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "The selected image is too large. Please choose a smaller image."
      : "The selected image could not be processed. Please check it and try again.";
    return res.status(400).json({ message });
  }
  if (Number.isInteger(error.http_code)) {
    return res.status(502).json({
      message: "Image upload failed. Check the Cloudinary configuration and try again.",
    });
  }

  return res.status(500).json({ message: "An unexpected server error occurred." });
});

app.get("/", (req, res) => {
  res.send("Gold Threads Jewellery API is running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const requiredVariables = ["MONGO_URI", "JWT_SECRET"];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]?.trim());

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }

  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch((error) => {
  console.error(`Server failed to start: ${error.message}`);
  process.exitCode = 1;
});