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

router.get("/", getProducts);
router.get("/admin", protectAdmin, getAdminProducts);
router.post("/", protectAdmin, upload.single("image"), createProduct);
router.get("/:id", getProductById);
router.put("/:id", protectAdmin, upload.single("image"), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

module.exports = router;
