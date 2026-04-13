import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFacultyTrend,
  fetchCourseAnalytics,
} from "../../redux/slices/dashboardSlice";
import axiosInstance from "../../services/axiosInstance";
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
import { Download, Brain, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const Analytics = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { facultyTrend, courseAnalytics } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    if (!user) return;

    dispatch(fetchFacultyTrend(user._id));
  }, [dispatch, user]);

  useEffect(() => {
    const firstCourseId = facultyTrend?.[0]?.course;

    if (firstCourseId) {
      dispatch(fetchCourseAnalytics(firstCourseId));
    }
  }, [dispatch, facultyTrend]);

  const handleExportCSV = async () => {
    try {
      const courseId = facultyTrend?.[0]?.course;
      if (!courseId) return;

      const response = await axiosInstance.get(
        `/analytics/course/${courseId}/export/csv`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `course-${courseId}-analytics.csv`;
      link.click();

      toast.success("CSV exported");
    } catch {
      toast.error("CSV export failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Average Score"
          value={courseAnalytics?.averageScore || 0}
          color="text-indigo-600 dark:text-cyan-300"
        />
        <StatCard
          title="Total Submissions"
          value={courseAnalytics?.totalSubmissions || 0}
          color="text-emerald-600 dark:text-emerald-300"
        />
        <button
          onClick={handleExportCSV}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
          dark:border-white/10 dark:bg-slate-900"
        >
          <div className="flex items-center justify-center gap-3 text-indigo-600 dark:text-cyan-300">
            <Download size={22} />
            <span className="font-semibold">Export CSV</span>
          </div>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-indigo-200 bg-linear-to-br
        from-indigo-50 to-purple-50 p-6 shadow-sm
        dark:border-cyan-500/20 dark:from-slate-900 dark:to-slate-950"
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="rounded-2xl bg-indigo-100 p-3 text-indigo-600
            dark:bg-cyan-500/10 dark:text-cyan-300"
          >
            <Brain size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              AI Smart Insights
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Intelligent academic recommendations from student feedback
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {courseAnalytics?.insights?.length ? (
            courseAnalytics.insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl bg-white/70 p-4
                shadow-sm dark:bg-slate-800/60"
              >
                <Sparkles
                  size={18}
                  className="mt-0.5 text-indigo-500 dark:text-cyan-300"
                />
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {insight}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              Insights will appear once feedback data is available.
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 
        shadow-sm dark:border-white/10 dark:bg-slate-900"
      >
        <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
          Faculty Trend Analytics
        </h3>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={facultyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="averageScore" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 
        shadow-sm dark:border-white/10 dark:bg-slate-900"
      >
        <h3 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
          Course Outcome Attainment
        </h3>

        <div className="h-96">
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
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  return (
    <div
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm
      dark:border-white/10 dark:bg-slate-900"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h2 className={`mt-3 text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
};

export default Analytics;
