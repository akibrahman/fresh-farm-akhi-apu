import Category from "../models/categoryModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => { 
    const categories = await Category.find({});
    res.json(categories);
});

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { categoryName, categoryDescription } = req.body;

    const category = await Category.create({
        name: categoryName,
        description: categoryDescription,
    });
    res.status(201).json(category);
});

// @desc    Update a category
// @route   PATCH /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.status(200).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Category removed" });
});

export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
