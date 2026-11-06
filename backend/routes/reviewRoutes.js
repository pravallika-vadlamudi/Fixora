import { Router } from "express";
import { createReview, serviceReviews } from "../controllers/reviewController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/service/:serviceId", serviceReviews);
router.post("/", protect, allowRoles("customer"), createReview);
export default router;
