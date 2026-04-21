import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Topbar from "./Topbar";

const DashboardShell = ({ sidebar: SidebarComponent }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0b0f1a]">
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <SidebarComponent />
        </div>

        {/* Main content */}
        <main className="flex-1 min-h-screen flex flex-col min-w-0">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <div className="flex-1 p-4 md:p-7">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <SidebarComponent mobile />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
              >
                <X size={16} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardShell;
