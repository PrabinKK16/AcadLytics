import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Landing
import Landing from "../pages/landing/Landing";

// Layouts
import StudentLayout from "../components/layout/StudentLayout";
import FacultyLayout from "../components/layout/FacultyLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Guards
import RoleRoute from "../components/auth/RoleRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Student pages
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentFeedback from "../pages/student/StudentFeedback";
import StudentHistory from "../pages/student/StudentHistory";
import StudentNotifications from "../pages/student/StudentNotifications";

// Faculty pages
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import FacultyAnalytics from "../pages/faculty/FacultyAnalytics";
import FacultyNotifications from "../pages/faculty/FacultyNotifications";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminForms from "../pages/admin/AdminForms";
import AdminQuestions from "../pages/admin/AdminQuestions";
import AdminNotifications from "../pages/admin/AdminNotifications";

// Shared
import Profile from "../pages/shared/Profile";

const RoleRedirect = () => {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "student") return <Navigate to="/student" replace />;
  if (user?.role === "faculty") return <Navigate to="/faculty" replace />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<RoleRedirect />} />

    {/* Student routes */}
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
    </Route>

    {/* Faculty routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={["faculty"]} />}>
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<FacultyDashboard />} />
          <Route path="analytics" element={<FacultyAnalytics />} />
          <Route path="notifications" element={<FacultyNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Route>

    {/* Admin routes */}
    <Route element={<ProtectedRoute />}>
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
