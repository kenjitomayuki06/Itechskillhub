import { Router } from "express";
import { getAdminDashboardStats } from "../controller/adminControllers/adminDashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

 const adminRouter = Router();

 // to secure GET route for site wide admin metrics
adminRouter.get("/admin/dashboard", protect, getAdminDashboardStats);

export default adminRouter;