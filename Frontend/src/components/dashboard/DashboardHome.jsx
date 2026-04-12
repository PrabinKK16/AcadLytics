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

  const user = useSelector((state) => state.auth);
  const { facultyTrend, courseAnalytics, notifications, unreadCount, loading } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!user) return;

    if (user.role === "faculty" || user.role === "admin") {
      dispatch(fetchFacultyTrend(user._id));
    }

    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());

    const sampleCourseId = facultyTrend?.[0]?.courseId;
    if (sampleCourseId) {
      dispatch(fetchCourseAnalytics(sampleCourseId));
    }
  }, [dispatch, user]);

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
          value={notifications.length}
          color="text-emerald-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl xl:col-span-2">
          <h3 className="mb-6 text-lg font-semibold text-white">
            Faculty Trend
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={facultyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="semester" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          <h3 className="mb-6 text-lg font-semibold text-white">
            Recent Notifications
          </h3>

          <div className="space-y-4">
            {notifications.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="rounded-2xl bg-white/5 p-4 text-sm text-gray-300"
              >
                {item.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <h3 className="mb-6 text-lg font-semibold text-white">CO Attainment</h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseAnalytics?.coAttainment || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="coCode" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Bar
                dataKey="percentage"
                fill="#c084fc"
                radius={[10, 10, 0, 0]}
              />
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
      className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-2xl"
    >
      <p className="text-sm text-gray-300">{title}</p>
      <h2 className={`mt-3 text-3xl font-bold ${color}`}>{value}</h2>
    </motion.div>
  );
};

export default DashboardHome;
