const express = require("express");
const router = express.Router();
const { loginAdmin, getAdminProfile, updateAdminCredentials } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/credentials", protectAdmin, updateAdminCredentials);

module.exports = router;