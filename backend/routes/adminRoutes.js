import { Router } from "express";
import { stats, users } from "../controllers/adminController.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(protect, allowRoles("admin"));
router.get("/stats", stats);
router.get("/users", users);
export default router;
