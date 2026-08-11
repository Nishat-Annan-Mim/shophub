import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.use(protect);

router.get("/me", userController.getMe);
router.get("/", restrictTo("ADMIN"), userController.getAllUsers);
router.get("/:id", restrictTo("ADMIN"), userController.getUserById);
router.patch("/:id", restrictTo("ADMIN"), userController.updateUser);
router.delete("/:id", restrictTo("ADMIN"), userController.deleteUser);

export default router;
