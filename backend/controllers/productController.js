const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const parseBoolean = (value, fieldName) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new Error(`${fieldName} must be true or false`);
};

const validateCategory = async (name) => {
  const categoryName = typeof name === "string" ? name.trim() : "";
  if (!categoryName) {
    throw new Error("A category is required");
  }

  const category = await Category.findOne({ name: categoryName, isActive: true });
  if (!category) {
    throw new Error("An active category with that name was not found");
  }

  return category.name;
};

const productFields = [
  "name",
  "price",
  "originalPrice",
  "designerInspo",
  "material",
  "waterproof",
  "nonTarnish",
  "badge",
  "rating",
  "reviewsCount",
  "description",
  "isActive",
];

exports.getProducts = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const productData = {};
    for (const field of productFields) {
      if (req.body[field] !== undefined) productData[field] = req.body[field];
    }
    productData.category = await validateCategory(req.body.category);
    productData.image = req.file.path;

    if (productData.waterproof !== undefined) {
      productData.waterproof = parseBoolean(productData.waterproof, "waterproof");
    }
    if (productData.nonTarnish !== undefined) {
      productData.nonTarnish = parseBoolean(productData.nonTarnish, "nonTarnish");
    }
    if (productData.isActive !== undefined) {
      productData.isActive = parseBoolean(productData.isActive, "isActive");
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const field of productFields) {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    }
    if (req.body.category !== undefined) {
      product.category = await validateCategory(req.body.category);
    }
    for (const field of ["waterproof", "nonTarnish", "isActive"]) {
      if (req.body[field] !== undefined) {
        product[field] = parseBoolean(req.body[field], field);
      }
    }
    if (req.file) product.image = req.file.path;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
