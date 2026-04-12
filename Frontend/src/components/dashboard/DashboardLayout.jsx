import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout() {
  return (
    <div
      className="min-h-screen 
      bg-slate-50 text-slate-900
      dark:bg-slate-950 dark:text-white"
    >
      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-screen">
          <Topbar />

          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
