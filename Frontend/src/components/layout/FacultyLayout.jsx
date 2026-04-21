import { LayoutDashboard, BarChart3, Bell, User } from "lucide-react";
import DashboardShell from "./DashboardShell";
import { SidebarShell, NavItem } from "./SidebarBase";

const navItems = [
  { label: "Dashboard", to: "/faculty", icon: LayoutDashboard, end: true },
  { label: "Analytics", to: "/faculty/analytics", icon: BarChart3 },
  { label: "Notifications", to: "/faculty/notifications", icon: Bell },
  { label: "Profile", to: "/faculty/profile", icon: User },
];

const FacultySidebar = ({ mobile }) => (
  <SidebarShell mobile={mobile}>
    <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
      Faculty
    </p>
    {navItems.map((item) => (
      <NavItem key={item.to} item={item} accent="violet" />
    ))}
  </SidebarShell>
);

const FacultyLayout = () => <DashboardShell sidebar={FacultySidebar} />;
export default FacultyLayout;
