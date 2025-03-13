import express from "express";
const router = express.Router();

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import protect from "../middleware/protectMiddleware.js";

router.route("/").get(getCategories).post(protect("admin"), createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .patch(protect("admin"), updateCategory)
  .delete(protect("admin"), deleteCategory);

export default router;
