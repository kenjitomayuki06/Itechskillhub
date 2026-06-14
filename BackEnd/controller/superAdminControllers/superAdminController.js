import bcrypt from 'bcrypt';
import {
    getSettingQuery,
    setSettingQuery,
    getOverviewStatsQuery,
    getAllAdminsQuery,
    createAdminQuery,
    updateAdminStatusQuery,
    deleteAdminQuery,
    getAdminByEmailQuery,
    getAllUsersQuery,
    updateUserStatusQuery,
    deleteUserQuery,
} from '../../database/superAdminQueries/superAdminQuery.js';

/* ════════════════════════ MAINTENANCE MODE ════════════════════════ */

// PUBLIC — checked by the frontend before rendering the app
export async function getMaintenanceStatus(req, res) {
    try {
        const value = await getSettingQuery('maintenance_mode');
        return res.status(200).json({
            success: true,
            maintenanceMode: value === 'true',
        });
    } catch (error) {
        console.error("Error fetching maintenance status:", error);
        // Fail-safe: if the check itself fails, don't lock everyone out
        return res.status(200).json({
            success: true,
            maintenanceMode: false,
        });
    }
}

// SUPER ADMIN ONLY — toggle maintenance mode on/off
export async function setMaintenanceStatus(req, res) {
    try {
        const { enabled } = req.body;
        await setSettingQuery('maintenance_mode', enabled ? 'true' : 'false');
        return res.status(200).json({
            success: true,
            maintenanceMode: !!enabled,
            message: enabled
                ? "Maintenance mode is now ON. The system is hidden from all users."
                : "Maintenance mode is now OFF. The system is live again.",
        });
    } catch (error) {
        console.error("Error updating maintenance status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update maintenance mode.",
        });
    }
}

/* ════════════════════════ OVERVIEW ════════════════════════ */

export async function getSuperAdminOverview(req, res) {
    try {
        const stats = await getOverviewStatsQuery();
        const maintenanceValue = await getSettingQuery('maintenance_mode');

        return res.status(200).json({
            success: true,
            stats,
            maintenanceMode: maintenanceValue === 'true',
        });
    } catch (error) {
        console.error("Error fetching super admin overview:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load system overview.",
        });
    }
}

/* ════════════════════════ MANAGE ADMINS ════════════════════════ */

export async function getAdmins(req, res) {
    try {
        const admins = await getAllAdminsQuery();
        return res.status(200).json({ success: true, admins });
    } catch (error) {
        console.error("Error fetching admins:", error);
        return res.status(500).json({ success: false, message: "Failed to load admins." });
    }
}

export async function createAdmin(req, res) {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and password are required."
            });
        }

        const targetRole = role === 'super_admin' ? 'super_admin' : 'admin';

        const existing = await getAdminByEmailQuery(email);
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "An admin account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createAdminQuery(fullName, email, hashedPassword, targetRole);

        return res.status(201).json({
            success: true,
            message: "Admin account created successfully."
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ success: false, message: "Failed to create admin." });
    }
}

export async function toggleAdminStatus(req, res) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        await updateAdminStatusQuery(id, isActive ? 1 : 0);

        return res.status(200).json({
            success: true,
            message: isActive ? "Admin account enabled." : "Admin account disabled."
        });
    } catch (error) {
        console.error("Error updating admin status:", error);
        return res.status(500).json({ success: false, message: "Failed to update admin status." });
    }
}

export async function deleteAdmin(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteAdminQuery(id);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete this admin (may be a super admin or not found)."
            });
        }

        return res.status(200).json({ success: true, message: "Admin account deleted." });
    } catch (error) {
        console.error("Error deleting admin:", error);
        return res.status(500).json({ success: false, message: "Failed to delete admin." });
    }
}

/* ════════════════════════ MANAGE USERS (Instructors/Students) ════════════════════════ */

export async function getUsers(req, res) {
    try {
        const { role } = req.query; // optional filter: 'student' | 'instructor'
        const users = await getAllUsersQuery(role || null);
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ success: false, message: "Failed to load users." });
    }
}

export async function toggleUserStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' | 'rejected' | 'pending'

        const allowed = ['active', 'rejected', 'pending', 'unverified'];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value."
            });
        }

        await updateUserStatusQuery(id, status);
        return res.status(200).json({ success: true, message: "User status updated." });
    } catch (error) {
        console.error("Error updating user status:", error);
        return res.status(500).json({ success: false, message: "Failed to update user status." });
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteUserQuery(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({ success: true, message: "User account deleted." });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ success: false, message: "Failed to delete user." });
    }
}