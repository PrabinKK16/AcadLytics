import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  User,
  BarChart3,
  ClipboardList,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Notifications",
    to: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Analytics",
    to: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Feedback",
    to: "/dashboard/feedback",
    icon: ClipboardList,
  },
  {
    label: "Profile",
    to: "/dashboard/profile",
    icon: User,
  },
];

const Sidebar = () => {
  return (
    <aside
      className="hidden w-72 border-r border-slate-200 bg-white 
      shadow-sm lg:flex lg:flex-col 
      dark:border-white/10 dark:bg-slate-900"
    >
      <div className="border-b border-slate-200 px-6 py-6 dark:border-white/10">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-cyan-400">
          AcadLytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Academic Intelligence
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 
                font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-cyan-500/10 dark:text-cyan-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
