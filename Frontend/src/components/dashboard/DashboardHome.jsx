import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFacultyTrend,
  fetchCourseAnalytics,
  fetchNotifications,
  fetchUnreadCount,
} from "../../redux/slices/dashboardSlice";
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
import { motion } from "framer-motion";
import { Bell, BarChart2, TrendingUp, Send } from "lucide-react";

const statCards = (unreadCount, courseAnalytics, notifications) => [
  {
    title: "Unread Alerts",
    value: unreadCount,
    icon: Bell,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-100 dark:border-rose-500/20",
  },
  {
    title: "Submissions",
    value: courseAnalytics?.totalSubmissions || 0,
    icon: Send,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border-indigo-100 dark:border-indigo-500/20",
  },
  {
    title: "Average Score",
    value: courseAnalytics?.averageScore?.toFixed(1) || "—",
    icon: BarChart2,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-100 dark:border-violet-500/20",
  },
  {
    title: "Notifications",
    value: notifications?.length || 0,
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-100 dark:border-emerald-500/20",
  },
];

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { facultyTrend, courseAnalytics, notifications, unreadCount } =
    useSelector((s) => s.dashboard);

  useEffect(() => {
    if (!user) return;
    if (user.role === "faculty" || user.role === "admin")
      dispatch(fetchFacultyTrend(user._id));
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch, user]);

  useEffect(() => {
    const id = facultyTrend?.[0]?.course;
    if (id) dispatch(fetchCourseAnalytics(id));
  }, [dispatch, facultyTrend]);

  const cards = statCards(unreadCount, courseAnalytics, notifications);

  return (
    <div className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl border ${card.border} bg-white p-5 shadow-sm dark:bg-[#111827]`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon size={18} className={card.color} />
                </span>
              </div>
              <p className={`mt-3 text-3xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/6 dark:bg-[#111827]"
        >
          <h3 className="mb-5 text-base font-semibold text-slate-700 dark:text-white">
            Faculty Score Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={facultyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  className="dark:stroke-white/5"
                />
                <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#6366f1" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/6 dark:bg-[#111827]"
        >
          <h3 className="mb-5 text-base font-semibold text-slate-700 dark:text-white">
            Recent Notifications
          </h3>
          <div className="space-y-3">
            {notifications?.slice(0, 5).length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No notifications yet.
              </p>
            )}
            {notifications?.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className={`rounded-xl p-3 text-sm ${item.isRead ? "bg-slate-50 text-slate-500 dark:bg-white/3 dark:text-slate-400" : "bg-indigo-50 text-slate-700 font-medium dark:bg-indigo-500/8 dark:text-slate-200"}`}
              >
                {item.message}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/6 dark:bg-[#111827]"
      >
        <h3 className="mb-5 text-base font-semibold text-slate-700 dark:text-white">
          CO Attainment
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseAnalytics?.coAttainment || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:stroke-white/5"
              />
              <XAxis dataKey="coCode" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="percentage" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
