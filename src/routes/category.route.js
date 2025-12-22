import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory, updateCategoryStatus } from '../controllers/category/category.controller.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.patch("/:id/status", updateCategoryStatus);
router.delete("/:id", deleteCategory);


export default router;


