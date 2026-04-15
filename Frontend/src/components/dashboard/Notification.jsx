import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../redux/slices/dashboardSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trash2, CheckCircle2, BellOff } from "lucide-react";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.dashboard);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const paginated = notifications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
      toast.success("Marked as read");
    } catch (e) {
      toast.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Notification deleted");
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
            <Bell size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-slate-800 dark:text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Notifications
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {notifications.length} total
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-white/6 dark:bg-[#111827]">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
              <BellOff
                size={28}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              No notifications yet
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            <AnimatePresence>
              {paginated.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/2 ${
                    !item.isRead ? "bg-indigo-50/60 dark:bg-indigo-500/4" : ""
                  }`}
                >
                  <div className="mt-1.5 shrink-0">
                    {!item.isRead ? (
                      <span className="block h-2 w-2 rounded-full bg-indigo-500" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-relaxed ${item.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-700 dark:text-slate-200 font-medium"}`}
                    >
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!item.isRead && (
                      <button
                        onClick={() => handleRead(item._id)}
                        className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                        title="Mark as read"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-lg bg-slate-100 p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:bg-white/5 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                page === i + 1
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 dark:bg-white/5 dark:border-white/10 dark:text-slate-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
