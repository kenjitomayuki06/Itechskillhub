import express from 'express';
import {
    getMaintenanceStatus,
    setMaintenanceStatus,
    getSuperAdminOverview,
    getAdmins,
    createAdmin,
    toggleAdminStatus,
    deleteAdmin,
    getUsers,
    toggleUserStatus,
    deleteUser,
} from '../controller/superAdminControllers/superAdminController.js';
import { protectAdmin, requireSuperAdmin } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

/* ── PUBLIC — checked by the frontend on every page load ── */
router.get('/system/maintenance-status', getMaintenanceStatus);

/* ── SUPER ADMIN ONLY ── */
router.get('/super-admin/overview', protectAdmin, requireSuperAdmin, getSuperAdminOverview);
router.post('/super-admin/maintenance', protectAdmin, requireSuperAdmin, setMaintenanceStatus);

// Manage Admins
router.get('/super-admin/admins', protectAdmin, requireSuperAdmin, getAdmins);
router.post('/super-admin/admins', protectAdmin, requireSuperAdmin, createAdmin);
router.patch('/super-admin/admins/:id/status', protectAdmin, requireSuperAdmin, toggleAdminStatus);
router.delete('/super-admin/admins/:id', protectAdmin, requireSuperAdmin, deleteAdmin);

// Manage Users (Instructors/Students)
router.get('/super-admin/users', protectAdmin, requireSuperAdmin, getUsers);
router.patch('/super-admin/users/:id/status', protectAdmin, requireSuperAdmin, toggleUserStatus);
router.delete('/super-admin/users/:id', protectAdmin, requireSuperAdmin, deleteUser);

export default router;