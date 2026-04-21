import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
  fetchUnreadCount,
} from "../../redux/slices/dashboardSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trash2, CheckCircle2, BellOff, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Card, SectionHeader, EmptyState } from "../../components/ui/index";

const ITEMS_PER_PAGE = 8;

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((s) => s.dashboard);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    await dispatch(fetchUnreadCount());
    setRefreshing(false);
    toast.success("Refreshed");
  };

  const handleRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
      toast.success("Marked as read");
    } catch (e) {
      toast.error(e || "Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Deleted");
    } catch (e) {
      toast.error(e || "Failed");
    }
  };

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const paginated = notifications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader
        title="Notifications"
        subtitle={`${notifications.length} total · ${unreadTotal} unread`}
        action={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-500 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
        }
      />

      <Card className="overflow-hidden">
        {loading && !notifications.length ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="All caught up!"
            subtitle="No notifications at the moment"
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            <AnimatePresence initial={false}>
              {paginated.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.015] ${!item.isRead ? "bg-indigo-50/50 dark:bg-indigo-500/[0.04]" : ""}`}
                >
                  <div className="mt-2 flex-shrink-0">
                    <span
                      className={`block h-2 w-2 rounded-full ${!item.isRead ? "bg-indigo-500 shadow-sm shadow-indigo-400/40" : "bg-slate-200 dark:bg-slate-700"}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm leading-relaxed ${!item.isRead ? "font-medium text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {item.message}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-600">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    {!item.isRead && (
                      <button
                        onClick={() => handleRead(item._id)}
                        title="Mark as read"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                      >
                        <CheckCircle2 size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:bg-white/5 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-lg text-sm font-semibold transition-all ${page === i + 1 ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25" : "border border-slate-200 bg-white text-slate-500 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
