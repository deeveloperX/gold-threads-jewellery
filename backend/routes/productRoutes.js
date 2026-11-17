const express = require("express");
const {
  getProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { upload } = require("../config/cloudinary");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const uploadProductMedia = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

router.get("/", getProducts);
router.get("/admin", protectAdmin, getAdminProducts);
router.post("/", protectAdmin, uploadProductMedia, createProduct);
router.get("/:id", getProductById);
router.put("/:id", protectAdmin, uploadProductMedia, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

module.exports = router;
