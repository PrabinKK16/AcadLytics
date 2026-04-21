import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  fetchUnreadCount,
} from "../../redux/slices/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  Bell,
  ArrowRight,
  Users,
  Activity,
} from "lucide-react";
import { SectionHeader, Card, EmptyState } from "../../components/ui/index";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { notifications, unreadCount } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const quickActions = [
    {
      title: "Create Course",
      desc: "Add a new course and assign faculty",
      icon: BookOpen,
      to: "/admin/courses",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-500/20",
    },
    {
      title: "Create Feedback Form",
      desc: "Set up a new form for a course",
      icon: ClipboardList,
      to: "/admin/forms",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
    },
    {
      title: "Add Questions",
      desc: "Add questions to a feedback form",
      icon: HelpCircle,
      to: "/admin/questions",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-100 dark:border-indigo-500/20",
    },
    {
      title: "Notifications",
      desc: `${unreadCount} unread system alerts`,
      icon: Bell,
      to: "/admin/notifications",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Admin Dashboard"
        subtitle={`Logged in as ${user?.name} · System administrator`}
      />

      {/* KPI overview bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-2xl border border-rose-200/60 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 p-5 dark:border-rose-500/20 dark:from-rose-500/[0.06] dark:via-pink-500/[0.04] dark:to-rose-500/[0.06]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600">
                <Activity size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  System Status
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All services operational
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
                  {unreadCount}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Unread alerts
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-700 dark:text-white">
                  {notifications.length}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Total notifications
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Quick Actions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.button
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(a.to)}
                className={`group flex items-start gap-4 rounded-2xl border ${a.border} bg-white p-5 shadow-sm text-left transition-all hover:shadow-md hover:-translate-y-0.5 dark:bg-[#111827]`}
              >
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${a.bg}`}
                >
                  <Icon size={20} className={a.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {a.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {a.desc}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="flex-shrink-0 mt-1 text-slate-300 transition group-hover:text-slate-500 dark:text-slate-700 dark:group-hover:text-slate-400"
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recent notifications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              System Notifications
            </h3>
            <button
              onClick={() => navigate("/admin/notifications")}
              className="text-xs font-semibold text-rose-600 transition hover:text-rose-700 dark:text-rose-400"
            >
              View all
            </button>
          </div>
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              subtitle="System alerts will appear here"
            />
          ) : (
            <div className="space-y-2.5">
              {notifications.slice(0, 5).map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${n.isRead ? "bg-slate-50 text-slate-500 dark:bg-white/[0.03] dark:text-slate-400" : "bg-rose-50/60 font-medium text-slate-700 dark:bg-rose-500/[0.06] dark:text-slate-200"}`}
                >
                  {!n.isRead && (
                    <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p>{n.message}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      {new Date(n.createdAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
