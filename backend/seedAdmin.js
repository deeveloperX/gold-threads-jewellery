const mongoose = require("mongoose");
require("dotenv").config();
const Admin = require("./models/Admin");

const seedAdmin = async () => {
  const requiredVariables = ["MONGO_URI", "ADMIN_NAME", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]?.trim());

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log("Admin account already exists.");
      return;
    }

    const admin = new Admin({
      name: process.env.ADMIN_NAME.trim(),
      email,
      passwordHash: process.env.ADMIN_PASSWORD,
    });

    await admin.save();
    console.log("Initial admin account created successfully.");
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin().catch((error) => {
  console.error(`Unable to seed admin account: ${error.message}`);
  process.exitCode = 1;
});