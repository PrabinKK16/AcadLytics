import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GraduationCap, LogOut } from "lucide-react";
import { logoutUser } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

export const NavItem = ({ item, accent = "indigo" }) => {
  const Icon = item.icon;
  const unreadCount = useSelector((s) => s.dashboard?.unreadCount) || 0;
  const isNotif = item.label === "Notifications";

  const activeStyle =
    accent === "violet"
      ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
      : accent === "rose"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
        : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

  const activeIconStyle =
    accent === "violet"
      ? "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
      : accent === "rose"
        ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
        : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400";

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
          isActive
            ? activeStyle
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
              isActive
                ? activeIconStyle
                : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
            }`}
          >
            <Icon size={15} />
          </span>
          <span className="flex-1">{item.label}</span>
          {isNotif && unreadCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          {isActive && !isNotif && (
            <span
              className={`h-1.5 w-1.5 rounded-full ${accent === "violet" ? "bg-violet-500" : "bg-indigo-500"}`}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

export const SidebarShell = ({ children, mobile = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

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
    <aside
      className={`
      ${mobile ? "w-64 flex" : "w-64 hidden lg:flex"}
      flex-col border-r border-slate-200/80 bg-white
      dark:border-white/[0.06] dark:bg-[#0d1117]
      ${mobile ? "h-full" : "min-h-screen sticky top-0"}
    `}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 dark:border-white/[0.06]">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <h1
            className="text-sm font-bold leading-tight text-slate-800 dark:text-white"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            AcadLytics
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Academic Intelligence
          </p>
        </div>
      </div>

      {/* Nav links injected per role */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {children}
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-100 p-3 dark:border-white/[0.06]">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/[0.03]">
          <img
            src={avatarUrl}
            className="h-8 w-8 flex-shrink-0 rounded-lg border border-slate-200 object-cover dark:border-white/10"
            alt=""
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700 dark:text-white">
              {user?.name}
            </p>
            <p className="text-[11px] capitalize text-slate-400 dark:text-slate-500">
              {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
