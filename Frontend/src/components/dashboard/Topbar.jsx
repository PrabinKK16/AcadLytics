import { Bell, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const unreadCount = useSelector((state) => state.dashboard?.unreadCount) || 0;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=random&color=ffffff&bold=true`;

  return (
    <header
      className="sticky top-0 z-20 border-b border-slate-200/70 
    bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70"
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
            {user?.role || "student"} dashboard
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative rounded-2xl border border-slate-200 bg-white p-2.5 
          shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-800"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />

            {unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center 
              justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white"
              >
                {unreadCount}
              </span>
            )}
          </button>

          <img
            src={avatarUrl}
            alt="avatar"
            className="h-11 w-11 rounded-full border-2 border-slate-200 object-cover 
            shadow-sm dark:border-white/10"
          />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm 
            font-medium text-white shadow-sm transition hover:bg-red-600 hover:shadow-md"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
