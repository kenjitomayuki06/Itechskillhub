import { Router } from "express";
import { getAdminDashboardStats } from "../controller/adminControllers/adminDashboardController.js";
import { adminLoginController } from "../controller/adminControllers/adminAuthController.js";
import { protectAdmin, requireSuperAdmin } from "../middleware/adminAuthMiddleware.js";

const adminRouter = Router();

// Admin & Super Admin Login
adminRouter.post("/admin/login", adminLoginController);

// Admin Dashboard (both admin and super_admin can access)
adminRouter.get("/admin/dashboard", protectAdmin, getAdminDashboardStats);

// Super Admin only routes (example)
adminRouter.get("/admin/manage-admins", protectAdmin, requireSuperAdmin, (req, res) => {
  res.json({ success: true, message: "Super Admin area" });
});

export default adminRouter;