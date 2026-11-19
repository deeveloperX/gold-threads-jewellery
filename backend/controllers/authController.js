const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        profileImagePath: admin.profileImagePath,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(`Admin login failed: ${error.message}`);
    res.status(500).json({ message: "Unable to log in" });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-passwordHash");
    res.json(admin);
  } catch (error) {
    console.error(`Unable to load admin profile: ${error.message}`);
    res.status(500).json({ message: "Unable to load admin profile" });
  }
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.updateAdminCredentials = async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body ?? {};
  const nextName = typeof name === "string" ? name.trim() : "";
  const nextEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!nextName || nextName.length > 80) {
    return res.status(400).json({ message: "Enter the name shown in the admin workspace." });
  }
  if (!EMAIL_PATTERN.test(nextEmail) || nextEmail.length > 254) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (typeof currentPassword !== "string" || !currentPassword) {
    return res.status(400).json({ message: "Enter your current password to save these changes." });
  }
  if (newPassword !== undefined && newPassword !== null && newPassword !== "") {
    if (typeof newPassword !== "string" || newPassword.length < 8 || newPassword.length > 128) {
      return res.status(400).json({ message: "Use a new password of at least 8 characters." });
    }
  }

  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin || !(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    admin.name = nextName;
    admin.email = nextEmail;
    if (typeof newPassword === "string" && newPassword) {
      admin.passwordHash = newPassword;
      admin.passwordChangedAt = new Date();
    }

    const saved = await admin.save();
    res.json({
      _id: saved._id,
      name: saved.name,
      email: saved.email,
      profileImagePath: saved.profileImagePath,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "That email is already in use." });
    }
    console.error(`Unable to update admin credentials: ${error.message}`);
    res.status(500).json({ message: "Unable to update admin credentials" });
  }
};