const express = require("express");
const router = express.Router();
const { loginAdmin, getAdminProfile } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);
router.get("/profile", protectAdmin, getAdminProfile);

module.exports = router;