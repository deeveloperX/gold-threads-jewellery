const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization) {
    return res.status(401).json({ message: "No authentication token provided" });
  }

  const [scheme, token, ...extraParts] = authorization.split(" ");
  if (scheme !== "Bearer" || !token || extraParts.length > 0) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (typeof decoded !== "object" || !decoded.id) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const admin = await Admin.findById(decoded.id).select("-passwordHash");
  if (!admin) {
    return res.status(401).json({ message: "Admin authorization failed" });
  }

  req.admin = admin;
  return next();
};

module.exports = { protectAdmin };