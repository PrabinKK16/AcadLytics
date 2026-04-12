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

const DashboardHome = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { facultyTrend, courseAnalytics, notifications, unreadCount } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!user) return;

    if (user.role === "faculty" || user.role === "admin") {
      dispatch(fetchFacultyTrend(user._id));
    }

    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch, user]);

  useEffect(() => {
    const sampleCourseId = facultyTrend?.[0]?.course;

    if (sampleCourseId) {
      dispatch(fetchCourseAnalytics(sampleCourseId));
    }
  }, [dispatch, facultyTrend]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Unread Alerts"
          value={unreadCount}
          color="text-pink-400"
        />
        <DashboardCard
          title="Submissions"
          value={courseAnalytics?.totalSubmissions || 0}
          color="text-cyan-400"
        />
        <DashboardCard
          title="Average Score"
          value={courseAnalytics?.averageScore || 0}
          color="text-violet-400"
        />
        <DashboardCard
          title="Notifications"
          value={notifications?.length || 0}
          color="text-emerald-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2 
        dark:border-white/10 dark:bg-slate-900"
        >
          <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
            Faculty Trend
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={facultyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  strokeWidth={3}
                  data={facultyTrend}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
        dark:border-white/10 dark:bg-slate-900"
        >
          <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
            Recent Notifications
          </h3>

          <div className="space-y-4">
            {notifications?.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 
                dark:bg-slate-800 dark:text-slate-300"
              >
                {item.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
          CO Attainment
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseAnalytics?.coAttainment || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="coCode" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
      dark:border-white/10 dark:bg-slate-900"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h2 className={`mt-3 text-3xl font-bold ${color}`}>{value}</h2>
    </motion.div>
  );
};

export default DashboardHome;
