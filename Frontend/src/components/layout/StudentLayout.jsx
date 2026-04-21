import {
  LayoutDashboard,
  ClipboardList,
  History,
  Bell,
  User,
} from "lucide-react";
import DashboardShell from "./DashboardShell";
import { SidebarShell, NavItem } from "./SidebarBase";

const navItems = [
  { label: "Dashboard", to: "/student", icon: LayoutDashboard, end: true },
  { label: "Submit Feedback", to: "/student/feedback", icon: ClipboardList },
  { label: "My History", to: "/student/history", icon: History },
  { label: "Notifications", to: "/student/notifications", icon: Bell },
  { label: "Profile", to: "/student/profile", icon: User },
];

const StudentSidebar = ({ mobile }) => (
  <SidebarShell mobile={mobile}>
    <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
      Student
    </p>
    {navItems.map((item) => (
      <NavItem key={item.to} item={item} accent="indigo" />
    ))}
  </SidebarShell>
);

const StudentLayout = () => <DashboardShell sidebar={StudentSidebar} />;
export default StudentLayout;
