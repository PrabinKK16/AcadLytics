import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardHome from "../components/dashboard/DashboardHome";
import Notifications from "../components/dashboard/Notification";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Profile from "../pages/dashboard/Profile";
import Analytics from "../pages/dashboard/Analytics";
import FeedbackForm from "../pages/dashboard/FeedbackForm";
import CreateCourse from "../pages/admin/CreateCourse";
import CreateFeedbackForm from "../pages/admin/CreateFeedbackForm";
import AddQuestion from "../pages/admin/AddQuestion";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="feedback" element={<FeedbackForm />} />
          <Route path="admin/create-course" element={<CreateCourse />} />
          <Route path="admin/create-form" element={<CreateFeedbackForm />} />
          <Route path="admin/add-question" element={<AddQuestion />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
