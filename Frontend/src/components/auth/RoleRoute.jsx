import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useSelector((s) => s.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    const redirectMap = {
      student: "/student",
      faculty: "/faculty",
      admin: "/admin",
    };
    return <Navigate to={redirectMap[user?.role] || "/login"} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
