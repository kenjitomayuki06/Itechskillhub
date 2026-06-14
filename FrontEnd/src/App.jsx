import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { apiFetch, getUser } from "./services/authService";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage1 from "./pages/home/LandingPage1";
import LandingPage2 from "./pages/home/LandingPage2";
import LandingPage3 from "./pages/home/LandingPage3";

import StudentLogin from "./pages/auth/StudentLogin";
import StudentForgotPassword from "./pages/auth/StudentForgotPassword";
import StudentResetPassword from "./pages/auth/StudentResetPassword";

import Course from "./pages/courses/Course";

// Dashboard Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Admin Pages
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import SuperAdminAdmins from "./pages/super-admin/SuperAdminAdmins";
import SuperAdminUsers from "./pages/super-admin/SuperAdminUsers";
import MaintenancePage from "./pages/MaintenancePage";

// Instructor Pages
import InstructorLogin from "./pages/auth/InstructorLogin";
import InstructorRegister from "./pages/auth/InstructorRegister";
import InstructorForgotPassword from "./pages/auth/InstructorForgotPassword";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorMyCourses from "./pages/instructor/InstructorMyCourses";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import InstructorAssignments from "./pages/instructor/InstructorAssignments";
import InstructorReports from "./pages/instructor/InstructorReports";

// Student Pages
import StudentDashboard     from "./pages/student/StudentDashboard";
import StudentCourses       from "./pages/student/StudentCourses";
import StudentAssignments   from "./pages/student/StudentAssignments";
import StudentQuiz          from "./pages/student/StudentQuiz";
import StudentProgress      from "./pages/student/StudentProgress";
import StudentCertificates  from "./pages/student/StudentCertificates";
import StudentProfile       from "./pages/student/StudentProfile";
import StudentNotifications from "./pages/student/StudentNotifications";

// About Page
import About from "./pages/about/About";

// Resources Pages
import Games from "./pages/Games";
import Blog from "./pages/Blog";

// 404 Page
import NotFound from "./pages/NotFound";

// Legal Pages
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";

//instructor pending page
import InstructorPending from "./pages/instructor/InstructorPending";
import StudentVerifyEmail from './pages/auth/StudentVerifyEmail';


function App() {
  const location = useLocation();

  /* ── Maintenance Mode check ── */
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceChecked, setMaintenanceChecked] = useState(false);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await apiFetch('/api/system/maintenance-status');
        setMaintenanceMode(!!res?.maintenanceMode);
      } catch (err) {
        // Fail open — don't lock everyone out if the check itself fails
        setMaintenanceMode(false);
      } finally {
        setMaintenanceChecked(true);
      }
    };
    checkMaintenance();
  }, []);

  // Super admins can always access the system, even during maintenance
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isSuperAdminRoute =
    location.pathname.startsWith('/super-admin') ||
    location.pathname === '/sys_superadmin_ItechSkillsHubphpAccess2026_v2';

  if (maintenanceChecked && maintenanceMode && !isSuperAdmin && !isSuperAdminRoute) {
    return <MaintenancePage />;
  }


  // Routes that use their own full-screen layout (no shared Navbar/Footer)
  const HIDE_LAYOUT_PREFIXES = ['/auth', '/admin', '/instructor', '/student', '/sys_admin_ItechSkillsHubphpAccess2026_v2', '/sys_superadmin_ItechSkillsHubphpAccess2026_v2', '/super-admin'];
  const hideLayout = HIDE_LAYOUT_PREFIXES.some(prefix =>
    location.pathname === prefix || location.pathname.startsWith(prefix + '/')
  );

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* HOME — public */}
        <Route
          path="/"
          element={
            <>
              <LandingPage1 />
              <div className="home-cover">
                <LandingPage2 />
                <LandingPage3 />
              </div>
            </>
          }
        />

        {/* ABOUT — public */}
        <Route path="/about" element={<About />} />

        {/* STUDENT AUTH */}
        <Route path="/auth" element={<StudentLogin />} />
        <Route path="/auth/reset-password" element={<StudentResetPassword />} />
        <Route path="/auth/forgot-password" element={<StudentForgotPassword />} />
        <Route path="/auth/verify-email" element={<StudentVerifyEmail />} />  {/* ← IDAGDAG */}

        {/* COURSES — public (login wall only on interactive actions inside) */}
        <Route path="/course/*" element={<Course />} />

        {/* RESOURCES — public */}
        <Route path="/games" element={<Games />} />
        <Route path="/blog"  element={<Blog />} />

        {/* ADMIN LOGIN - SECRET URL */}
        <Route path="/sys_admin_ItechSkillsHubphpAccess2026_v2" element={<AdminLogin />} />
        <Route path="/sys_superadmin_ItechSkillsHubphpAccess2026_v2" element={<AdminLogin />} />
        <Route path="/admin/login" element={<NotFound />} />

        {/* SUPER ADMIN DASHBOARD ROUTES — protected */}
<Route
  path="/super-admin"
  element={
    <ProtectedRoute role="super_admin">
      <ErrorBoundary>
        <DashboardLayout userRole="super_admin" />
      </ErrorBoundary>
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<SuperAdminDashboard />} />
  <Route path="admins" element={<SuperAdminAdmins />} />
  <Route path="users" element={<SuperAdminUsers />} />
</Route>

        {/* ADMIN DASHBOARD ROUTES — protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <ErrorBoundary>
                <DashboardLayout userRole="admin" />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<AdminDashboard />} />
          <Route path="users"       element={<AdminUsers />} />
          <Route path="courses"     element={<AdminCourses />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="analytics"   element={<AdminAnalytics />} />
          <Route path="settings"    element={<AdminSettings />} />
        </Route>

        {/* INSTRUCTOR AUTH */}
       <Route path="/instructor/login"           element={<InstructorLogin />} />
       <Route path="/instructor/register"        element={<InstructorRegister />} />
       <Route path="/instructor/forgot-password" element={<InstructorForgotPassword />} />
       <Route path="/instructor/pending"         element={<InstructorPending />} /> {/* ← DITO */}

        {/* INSTRUCTOR DASHBOARD ROUTES — protected */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <ErrorBoundary>
                <DashboardLayout userRole="instructor" />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<InstructorDashboard />} />
          <Route path="courses"     element={<InstructorMyCourses />} />
          <Route path="students"    element={<InstructorStudents />} />
          <Route path="assignments" element={<InstructorAssignments />} />
          <Route path="reports"     element={<InstructorReports />} />
        </Route>

        {/* STUDENT DASHBOARD ROUTES — protected */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <ErrorBoundary>
                <DashboardLayout userRole="student" />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<StudentDashboard />} />
          <Route path="courses"       element={<StudentCourses />} />
          <Route path="assignments"   element={<StudentAssignments />} />
          <Route path="quiz"          element={<StudentQuiz />} />
          <Route path="progress"      element={<StudentProgress />} />
          <Route path="certificates"  element={<StudentCertificates />} />
          <Route path="profile"       element={<StudentProfile />} />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>
        
        {/* LEGAL PAGES */}
        <Route path="/terms"   element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* 404 CATCH-ALL */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;