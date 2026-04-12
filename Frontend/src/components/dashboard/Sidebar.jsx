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
      className="hidden w-72 border-r 
    border-white/10 bg-white/5 backdrop-blur-xl lg:flex lg:flex-col"
    >
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-bold text-cyan-400">AcadLytics</h1>
        <p className="mt-1 text-sm text-gray-400">Academic Intelligence</p>
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
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
