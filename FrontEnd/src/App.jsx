import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage1 from "./pages/home/LandingPage1";
import LandingPage2 from "./pages/home/LandingPage2";
import LandingPage3 from "./pages/home/LandingPage3";

import StudentLogin from "./pages/auth/StudentLogin";

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

// Instructor Pages
import InstructorLogin from "./pages/auth/InstructorLogin";
import InstructorRegister from "./pages/auth/InstructorRegister";
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

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/auth" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/instructor") ||
    location.pathname.startsWith("/student");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* HOME */}
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

        {/* STUDENT AUTH */}
        <Route path="/auth" element={<StudentLogin />} />

        {/* COURSES */}
        <Route path="/course/*" element={<Course />} />

        {/* ABOUT */}
        <Route path="/about" element={<About />} />

        {/* RESOURCES */}
        <Route path="/games" element={<Games />} />
        <Route path="/blog" element={<Blog />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN DASHBOARD ROUTES — protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout userRole="admin" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* INSTRUCTOR AUTH */}
        <Route path="/instructor/login" element={<InstructorLogin />} />
        <Route path="/instructor/register" element={<InstructorRegister />} />

        {/* INSTRUCTOR DASHBOARD ROUTES — protected */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <DashboardLayout userRole="instructor" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorMyCourses />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="assignments" element={<InstructorAssignments />} />
          <Route path="reports" element={<InstructorReports />} />
        </Route>

        {/* STUDENT DASHBOARD ROUTES — protected */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout userRole="student" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard"     element={<StudentDashboard />} />
          <Route path="courses"       element={<StudentCourses />} />
          <Route path="assignments"   element={<StudentAssignments />} />
          <Route path="quiz"          element={<StudentQuiz />} />
          <Route path="progress"      element={<StudentProgress />} />
          <Route path="certificates"  element={<StudentCertificates />} />
          <Route path="profile"       element={<StudentProfile />} />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>

        {/* 404 CATCH-ALL */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;