import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

router.use(protect, restrictTo("ADMIN"));
router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
