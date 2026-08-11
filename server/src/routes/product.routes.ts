import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.use(protect, restrictTo("ADMIN"));
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
