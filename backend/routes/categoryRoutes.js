const express = require("express");
const router = express.Router();
const {
  getCategories,
  getPopularCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/", getCategories);
router.get("/popular", getPopularCategories);
router.post("/", protectAdmin, upload.single("image"), createCategory);
router.put("/:id", protectAdmin, upload.single("image"), updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

module.exports = router;
