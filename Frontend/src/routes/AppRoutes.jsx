import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOTP from "../pages/auth/VerifyOTP";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Landing from "../pages/landing/Landing";

import StudentLayout from "../components/layout/StudentLayout";
import FacultyLayout from "../components/layout/FacultyLayout";
import AdminLayout from "../components/layout/AdminLayout";

import RoleRoute from "../components/auth/RoleRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentFeedback from "../pages/student/StudentFeedback";
import StudentHistory from "../pages/student/StudentHistory";
import StudentNotifications from "../pages/student/StudentNotifications";

import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import FacultyAnalytics from "../pages/faculty/FacultyAnalytics";
import FacultyNotifications from "../pages/faculty/FacultyNotifications";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminForms from "../pages/admin/AdminForms";
import AdminQuestions from "../pages/admin/AdminQuestions";
import AdminNotifications from "../pages/admin/AdminNotifications";

import Profile from "../pages/shared/Profile";

const RoleRedirect = () => {
  const { user, isAuthenticated, authInitialized } = useSelector((s) => s.auth);

  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#0b0f1a] dark:to-[#0d1117]">
        <div className="h-10 w-10 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "student") return <Navigate to="/student" replace />;
  if (user?.role === "faculty") return <Navigate to="/faculty" replace />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;

  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-otp" element={<VerifyOTP />} />
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/dashboard" element={<RoleRedirect />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="feedback" element={<StudentFeedback />} />
          <Route path="history" element={<StudentHistory />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allowedRoles={["faculty"]} />}>
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<FacultyDashboard />} />
          <Route path="analytics" element={<FacultyAnalytics />} />
          <Route path="notifications" element={<FacultyNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="forms" element={<AdminForms />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<RoleRedirect />} />
  </Routes>
);

export default AppRoutes;
