const Category = require("../models/Category");

const handleCategoryError = (res, error, action, message) => {
  console.error(`${action} failed:`, error);
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: "Please check the category details and try again." });
  }
  if (error.code === 11000) {
    return res.status(400).json({ message: "A category with these details already exists." });
  }
  return res.status(500).json({ message });
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(categories);
  } catch (error) {
    handleCategoryError(res, error, "Loading categories", "Unable to load categories right now. Please try again.");
  }
};

exports.getPopularCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true, showPopular: true }).sort({ displayOrder: 1 });
    res.json(categories);
  } catch (error) {
    handleCategoryError(res, error, "Loading popular categories", "Unable to load collections right now. Please try again.");
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, showPopular, displayOrder } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Category image is required" });
    }

    const category = new Category({
      name,
      slug,
      imagePath: req.file.path, // Secure Cloudinary URL
      showPopular: showPopular === "true" || showPopular === true,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    handleCategoryError(res, error, "Creating category", "Unable to save this category. Please try again.");
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, slug, showPopular, displayOrder, isActive } = req.body;    
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Update fields if provided
    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (showPopular !== undefined) category.showPopular = showPopular === "true" || showPopular === true;
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
    if (isActive !== undefined) category.isActive = isActive === "true" || isActive === true;

    // If a new image was uploaded to Cloudinary, update the image path
    if (req.file) {
      category.imagePath = req.file.path;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    handleCategoryError(res, error, "Updating category", "Unable to save this category. Please try again.");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    handleCategoryError(res, error, "Deleting category", "Unable to delete this category. Please try again.");
  }
};