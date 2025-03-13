import express from "express";
import {
  getSubCategory,
  createNewSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategoryController.js";

const router = express.Router();

router.route("/").get(getSubCategory).post(createNewSubCategory);

router.route("/:id").put(updateSubCategory).delete(deleteSubCategory);

export default router;
