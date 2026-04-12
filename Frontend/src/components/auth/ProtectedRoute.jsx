import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center 
      bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100"
      >
        <div
          className="h-12 w-12 rounded-full border-4 
        border-indigo-500 border-t-transparent animate-spin"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
