import subCategoryModel from "../models/subCategoryModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import CategoryModel from "../models/categoryModel.js";

// @desc    Fetch all subCategory
// @route   GET /api/subCategory
// @access  Public
const getSubCategory = asyncHandler(async (req, res) => {
  const subCategories = await subCategoryModel
    .find({})
    .populate("category_id", "name");

  res.status(200).json(subCategories);
});

// @desc    Create New SubCategory
// @route   POST /api/subCategory
// @access  Admin
const createNewSubCategory = asyncHandler(async (req, res) => {
  try {
    const { category_id, ...subCategoryData } = req.body;

    if (!category_id) {
      return res.status(400).send("Category ID is required");
    }

    const newSubCategory = new subCategoryModel(subCategoryData);
    const savedSubCategory = await newSubCategory.save();

    await CategoryModel.updateOne(
      { _id: category_id },
      { $push: { subCategories: savedSubCategory._id } }
    );

    res.status(200).send("SubCategory has been added");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @desc    Update a SubCategory
// @route   PATCH /api/subCategory/:id
// @access  Admin
const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, categoryId } = req.body;

  const subCategory = await subCategoryModel.findById(id);

  if (!subCategory) {
    return res.status(404).send("SubCategory not found");
  }

  subCategory.name = name || subCategory.name;
  subCategory.description = description || subCategory.description;

  if (categoryId && categoryId !== subCategory.category_id.toString()) {
    await CategoryModel.updateOne(
      { _id: subCategory.category_id },
      { $pull: { subCategories: subCategory._id } }
    );

    await CategoryModel.updateOne(
      { _id: categoryId },
      { $push: { subCategories: subCategory._id } }
    );

    subCategory.category_id = categoryId;
  }

  const updatedSubCategory = await subCategory.save();

  res.status(200).json(updatedSubCategory);
});

// @desc    Delete a SubCategory
// @route   DELETE /api/subCategory/:id
// @access  Admin
const deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subCategory = await subCategoryModel.findById(id);

  if (!subCategory) {
    return res.status(404).send("SubCategory not found");
  }

  await CategoryModel.updateOne(
    { _id: subCategory.category_id },
    { $pull: { subCategories: subCategory._id } }
  );

  await subCategory.deleteOne();

  res.status(200).send("SubCategory has been deleted");
});

export {
  getSubCategory,
  createNewSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
