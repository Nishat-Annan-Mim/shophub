import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.use(protect);

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", restrictTo("ADMIN"), orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

export default router;
