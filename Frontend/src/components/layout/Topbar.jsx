import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Sun, Moon, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const roleBase = { student: "/student", faculty: "/faculty", admin: "/admin" };

const Topbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((s) => s.auth);
  const unreadCount = useSelector((s) => s.dashboard?.unreadCount) || 0;

  const base = roleBase[user?.role] || "/dashboard";

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=6366f1&color=fff&bold=true&size=128`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0b0f1a]/85">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 lg:hidden dark:border-white/10 dark:bg-white/5"
          >
            <Menu size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              Welcome back,{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </p>
            <p className="text-xs capitalize text-slate-400 dark:text-slate-500">
              {user?.role} · AcadLytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 dark:border-white/10 dark:bg-white/5"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Sun size={17} className="text-amber-400" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Moon size={17} className="text-slate-500" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate(`${base}/notifications`)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 dark:border-white/10 dark:bg-white/5"
          >
            <Bell size={17} className="text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#0b0f1a]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar → Profile */}
          <button
            onClick={() => navigate(`${base}/profile`)}
            className="relative group"
          >
            <img
              src={avatarUrl}
              alt={user?.name}
              className="h-9 w-9 rounded-xl border-2 border-slate-200 object-cover shadow-sm transition group-hover:border-indigo-400 dark:border-white/10"
            />
            <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0b0f1a]" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
