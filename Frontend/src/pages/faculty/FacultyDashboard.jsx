import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFacultyTrend,
  fetchCourseAnalytics,
  fetchNotifications,
  fetchUnreadCount,
} from "../../redux/slices/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Send,
  Bell,
  ArrowRight,
  Sparkles,
  Brain,
} from "lucide-react";
import { SectionHeader, Card, EmptyState } from "../../components/ui/index";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { ChartTooltip } from "../../components/charts/ChartTooltip";

export default function FacultyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { facultyTrend, courseAnalytics, notifications, unreadCount, loading } =
    useSelector((s) => s.dashboard);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchFacultyTrend(user._id));
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch, user]);

  useEffect(() => {
    const id = facultyTrend?.[0]?.course;
    if (id) dispatch(fetchCourseAnalytics(id));
  }, [dispatch, facultyTrend]);

  const stats = [
    {
      title: "Average Score",
      value:
        courseAnalytics?.averageScore != null
          ? Number(courseAnalytics.averageScore).toFixed(1)
          : "—",
      icon: BarChart3,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      border: "border-violet-100 dark:border-violet-500/20",
      to: "/faculty/analytics",
    },
    {
      title: "Total Submissions",
      value: courseAnalytics?.totalSubmissions ?? "—",
      icon: Send,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-100 dark:border-indigo-500/20",
      to: "/faculty/analytics",
    },
    {
      title: "Courses Tracked",
      value: facultyTrend?.length || 0,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-500/20",
      to: "/faculty/analytics",
    },
    {
      title: "Unread Alerts",
      value: unreadCount,
      icon: Bell,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-500/20",
      to: "/faculty/notifications",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Faculty Dashboard"
        subtitle={`Overview for ${user?.name} · ${facultyTrend?.[0]?.courseCode || "All courses"}`}
        action={
          <button
            onClick={() => navigate("/faculty/analytics")}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700"
          >
            Full Analytics <ArrowRight size={14} />
          </button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => navigate(s.to)}
              className={`group w-full text-left rounded-2xl border ${s.border} bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:bg-[#111827]`}
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {s.title}
                </p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}
                >
                  <Icon size={17} className={s.color} />
                </span>
              </div>
              <p
                className={`mt-3 text-3xl font-bold tracking-tight ${s.color}`}
              >
                {s.value}
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 group-hover:text-violet-500 transition-colors dark:text-slate-500">
                View <ArrowRight size={11} />
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="xl:col-span-2"
        >
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                  Semester Score Trend
                </h3>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Average feedback score over semesters
                </p>
              </div>
              <button
                onClick={() => navigate("/faculty/analytics")}
                className="flex items-center gap-1 text-xs font-semibold text-violet-600 transition hover:text-violet-700 dark:text-violet-400"
              >
                Details <ArrowRight size={11} />
              </button>
            </div>
            {loading && !facultyTrend.length ? (
              <div className="h-56 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={facultyTrend}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f040"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="semester"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#7c3aed"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        fill: "#7c3aed",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Notifications sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.33 }}
        >
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                Recent Alerts
              </h3>
              <button
                onClick={() => navigate("/faculty/notifications")}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400"
              >
                View all
              </button>
            </div>
            {notifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notifications"
                subtitle="You're all caught up"
              />
            ) : (
              <div className="space-y-2.5">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    className={`rounded-xl px-3.5 py-3 text-xs leading-relaxed ${n.isRead ? "bg-slate-50 text-slate-500 dark:bg-white/[0.03] dark:text-slate-400" : "bg-violet-50 text-slate-700 font-medium dark:bg-violet-500/[0.08] dark:text-slate-200"}`}
                  >
                    <div className="flex gap-2">
                      {!n.isRead && (
                        <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                      )}
                      <span>{n.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      {courseAnalytics?.insights?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:border-violet-500/20 dark:from-violet-500/[0.06] dark:to-purple-500/[0.04]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/15">
                <Brain
                  size={18}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  AI Smart Insights
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Auto-generated from feedback data
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              {courseAnalytics.insights.slice(0, 3).map((ins, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-white/70 p-3.5 shadow-sm dark:bg-slate-800/50"
                >
                  <Sparkles
                    size={15}
                    className="mt-0.5 flex-shrink-0 text-violet-500 dark:text-violet-400"
                  />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {ins}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
