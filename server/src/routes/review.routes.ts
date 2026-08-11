import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);

router.use(protect);
router.post("/", reviewController.createReview);
router.patch("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;
