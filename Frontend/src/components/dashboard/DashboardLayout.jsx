import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900
    dark:bg-[#0b0f1a] dark:text-white"
    >
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen flex flex-col">
          <Topbar />
          <div className="flex-1 p-5 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
