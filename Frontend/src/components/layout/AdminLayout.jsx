import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  HelpCircle,
  Bell,
  User,
} from "lucide-react";
import DashboardShell from "./DashboardShell";
import { SidebarShell, NavItem } from "./SidebarBase";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Forms", to: "/admin/forms", icon: ClipboardList },
  { label: "Questions", to: "/admin/questions", icon: HelpCircle },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Profile", to: "/admin/profile", icon: User },
];

const AdminSidebar = ({ mobile }) => (
  <SidebarShell mobile={mobile}>
    <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
      Admin
    </p>
    {navItems.map((item) => (
      <NavItem key={item.to} item={item} accent="rose" />
    ))}
  </SidebarShell>
);

const AdminLayout = () => <DashboardShell sidebar={AdminSidebar} />;
export default AdminLayout;
