import { Bell, LogOut, Sun, Moon, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
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
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=6366f1&color=ffffff&bold=true`;

  return (
    <header
      className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl
    dark:border-white/6 dark:bg-[#0b0f1a]/80"
    >
      <div className="flex items-center justify-between px-6 py-3.5 md:px-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white leading-tight">
            Welcome back,{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {user?.name || "User"}
            </span>
          </h2>
          <p className="text-xs capitalize text-slate-400 dark:text-slate-500 mt-0.5">
            {user?.role || "student"} · AcadLytics Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm
            transition-all hover:shadow-md hover:border-indigo-300 dark:border-white/10
            dark:bg-white/5 dark:hover:border-indigo-500/50"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-slate-500" />
            )}
          </button>

          <button
            onClick={() => navigate("/dashboard/notifications")}
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm
            transition-all hover:shadow-md hover:border-indigo-300 dark:border-white/10
            dark:bg-white/5 dark:hover:border-indigo-500/50"
            title="Notifications"
          >
            <Bell size={18} className="text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center
              rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-lg"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/dashboard/profile")}
            className="relative group"
            title="View Profile"
          >
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-9 w-9 rounded-full border-2 border-slate-200 object-cover shadow-sm
               transition group-hover:border-indigo-400 dark:border-white/10
                dark:group-hover:border-indigo-500"
            />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2.5 text-sm
            font-medium text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600
            dark:bg-white/5 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
