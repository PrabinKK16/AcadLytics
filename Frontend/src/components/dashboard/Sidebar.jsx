import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  User,
  BarChart3,
  ClipboardList,
  PlusSquare,
  BookOpen,
  HelpCircle,
  GraduationCap,
} from "lucide-react";
import { useSelector } from "react-redux";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3 },
  { label: "Feedback", to: "/dashboard/feedback", icon: ClipboardList },
  { label: "Notifications", to: "/dashboard/notifications", icon: Bell },
  { label: "Profile", to: "/dashboard/profile", icon: User },
];

const adminItems = [
  {
    label: "Create Course",
    to: "/dashboard/admin/create-course",
    icon: BookOpen,
  },
  {
    label: "Create Form",
    to: "/dashboard/admin/create-form",
    icon: PlusSquare,
  },
  {
    label: "Add Question",
    to: "/dashboard/admin/add-question",
    icon: HelpCircle,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  return (
    <aside className="hidden w-64 border-r border-slate-200/80 bg-white lg:flex lg:flex-col dark:border-white/6 dark:bg-[#0d1117]">
      <div className="px-6 py-6 border-b border-slate-100 dark:border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <h1
              className="text-base font-bold text-slate-800 dark:text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              AcadLytics
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
              Academic Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
          Main
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {isAdmin && (
          <>
            <p className="px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
              Admin
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                          isActive
                            ? "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-white/6">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-white/3">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=6366f1&color=fff&bold=true`
            }
            className="h-8 w-8 rounded-full border border-slate-200 dark:border-white/10 object-cover"
            alt="avatar"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-[11px] capitalize text-slate-400 dark:text-slate-500">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
