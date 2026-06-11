import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  fetchUnreadCount,
  fetchCourseAnalytics,
  fetchFacultyTrend,
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
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Brain,
  Sparkles,
  Download,
  ChevronDown,
} from "lucide-react";
import {
  SectionHeader,
  Card,
  EmptyState,
  LevelBadge,
  Skeleton,
} from "../../components/ui/index";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { ChartTooltip } from "../../components/charts/ChartTooltip";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const LEVEL_COLORS = { High: "#10b981", Medium: "#f59e0b", Low: "#ef4444" };

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { notifications, unreadCount, courseAnalytics, facultyTrend, loading } =
    useSelector((s) => s.dashboard);

  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());

    const loadFaculty = async () => {
      try {
        const res = await axiosInstance.get("/profile/faculty");
        const list = res.data?.data || [];
        setFacultyList(list);
        if (list.length > 0) {
          setSelectedFaculty(list[0]);
        }
      } catch {
        toast.error("Could not load faculty list");
      } finally {
        setFacultyLoading(false);
      }
    };

    loadFaculty();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedFaculty) return;
    dispatch(fetchFacultyTrend(selectedFaculty._id));
    setSelectedCourseId(null);
  }, [dispatch, selectedFaculty]);

  useEffect(() => {
    if (facultyTrend?.length > 0 && !selectedCourseId) {
      const firstCourseId = facultyTrend[0].course;
      setSelectedCourseId(firstCourseId);
      dispatch(fetchCourseAnalytics(firstCourseId));
    }
  }, [dispatch, facultyTrend, selectedCourseId]);

  const handleCourseSelect = useCallback(
    (courseId) => {
      setSelectedCourseId(courseId);
      dispatch(fetchCourseAnalytics(courseId));
    },
    [dispatch],
  );

  const handleExportCSV = async () => {
    const courseId = selectedCourseId || courseAnalytics?.course?.id;
    if (!courseId) return toast.error("No course data available");
    try {
      const res = await axiosInstance.get(
        `/analytics/course/${courseId}/export/csv`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "text/csv" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${courseId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Export failed");
    }
  };

  const weakAreas =
    courseAnalytics?.coAttainment?.filter((co) => co.level === "Low") || [];

  const analyticsStatCards = courseAnalytics
    ? [
        {
          title: "Average Score",
          value: courseAnalytics.averageScore?.toFixed(1) ?? "—",
          suffix: "/ 5",
          icon: BarChart3,
          color: "text-violet-600 dark:text-violet-400",
          bg: "bg-violet-50 dark:bg-violet-500/10",
          border: "border-violet-100 dark:border-violet-500/20",
        },
        {
          title: "Total Submissions",
          value: courseAnalytics.totalSubmissions ?? "—",
          icon: Users,
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-50 dark:bg-indigo-500/10",
          border: "border-indigo-100 dark:border-indigo-500/20",
        },
        {
          title: "High Attainment COs",
          value:
            courseAnalytics.coAttainment?.filter((c) => c.level === "High")
              .length ?? "—",
          icon: TrendingUp,
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          border: "border-emerald-100 dark:border-emerald-500/20",
        },
        {
          title: "Weak Areas",
          value: weakAreas.length,
          icon: AlertTriangle,
          color: "text-rose-600 dark:text-rose-400",
          bg: "bg-rose-50 dark:bg-rose-500/10",
          border: "border-rose-100 dark:border-rose-500/20",
        },
      ]
    : [];

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

      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Course Analytics Overview
          </h3>
          {courseAnalytics && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400"
            >
              <Download size={13} /> Export CSV
            </button>
          )}
        </div>

        {facultyLoading ? (
          <Skeleton className="mb-4 h-11 w-64" />
        ) : facultyList.length === 0 ? (
          <p className="mb-4 text-sm text-slate-400">No faculty found.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex flex-wrap items-center gap-3"
          >
            <div className="relative">
              <select
                value={selectedFaculty?._id || ""}
                onChange={(e) => {
                  const f = facultyList.find((x) => x._id === e.target.value);
                  setSelectedFaculty(f || null);
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-9 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-white/10 dark:bg-[#111827] dark:text-white"
              >
                {facultyList.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {facultyTrend?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {facultyTrend.map((snap) => (
                  <button
                    key={snap.course}
                    onClick={() => handleCourseSelect(snap.course)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      selectedCourseId === snap.course
                        ? "bg-violet-600 text-white shadow"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300 dark:border-white/10 dark:bg-[#111827] dark:text-slate-300"
                    }`}
                  >
                    {snap.courseCode || snap.course}
                    <span className="ml-1 opacity-60">· {snap.semester}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {facultyTrend?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <Card className="p-6">
              <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-white">
                Career Score Trend —{" "}
                <span className="font-normal text-slate-400">
                  {selectedFaculty?.name}
                </span>
              </h3>
              <p className="mb-5 text-xs text-slate-400 dark:text-slate-500">
                Average score progression across all semesters
              </p>
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
                      domain={[0, 5]}
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
              <div className="mt-4 flex flex-wrap gap-2">
                {facultyTrend.map((snap) => (
                  <div
                    key={snap.course}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs dark:border-white/[0.06] dark:bg-white/[0.03]"
                  >
                    <span className="font-semibold text-slate-700 dark:text-white">
                      {snap.courseCode}
                    </span>
                    <span className="ml-1 text-slate-400">
                      · {snap.semester}
                    </span>
                    <div className="mt-0.5 flex gap-2 text-[10px]">
                      <span className="text-emerald-600">
                        ↑{snap.highCOs} High
                      </span>
                      <span className="text-amber-500">
                        ~{snap.mediumCOs} Med
                      </span>
                      <span className="text-rose-500">↓{snap.lowCOs} Low</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : courseAnalytics ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {analyticsStatCards.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`rounded-2xl border ${s.border} bg-white p-5 shadow-sm dark:bg-[#111827]`}
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
                      {s.suffix && (
                        <span className="text-base font-normal text-slate-400 ml-1">
                          {s.suffix}
                        </span>
                      )}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <Card className="p-6">
                <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-white">
                  CO Attainment —{" "}
                  <span className="font-normal text-slate-400">
                    {courseAnalytics.course?.code} ·{" "}
                    {courseAnalytics.course?.name}
                  </span>
                </h3>
                <p className="mb-5 text-xs text-slate-400 dark:text-slate-500">
                  Attainment % per Course Outcome
                </p>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courseAnalytics.coAttainment}
                      margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f040"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="coCode"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar
                        dataKey="percentage"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={52}
                      >
                        {courseAnalytics.coAttainment.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={LEVEL_COLORS[entry.level] || "#6366f1"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.06]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/[0.06] dark:bg-white/[0.02]">
                        {["CO", "Description", "Score", "Level"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                      {courseAnalytics.coAttainment.map((co) => (
                        <tr
                          key={co.coCode}
                          className="transition hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-700 dark:text-white">
                            {co.coCode}
                          </td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                            {co.description}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-700 dark:text-white">
                            {co.percentage}%
                          </td>
                          <td className="px-4 py-3">
                            <LevelBadge level={co.level} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {courseAnalytics?.insights?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                className="mt-4"
              >
                <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:border-violet-500/20 dark:from-violet-500/[0.06] dark:to-purple-500/[0.04]">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/15">
                      <Brain
                        size={18}
                        className="text-violet-700 dark:text-violet-400"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white">
                        AI Smart Insights
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Generated from feedback patterns
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {courseAnalytics.insights.map((ins, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl bg-white/70 p-4 shadow-sm dark:bg-slate-800/50"
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

            {weakAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="mt-4"
              >
                <div className="rounded-2xl border border-rose-200/60 bg-rose-50/70 p-5 dark:border-rose-500/20 dark:bg-rose-500/[0.05]">
                  <div className="flex items-center gap-2.5 mb-3">
                    <AlertTriangle
                      size={16}
                      className="text-rose-600 dark:text-rose-400"
                    />
                    <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                      Weak Teaching Areas Detected
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {weakAreas.map((co) => (
                      <span
                        key={co.coCode}
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm dark:bg-rose-500/10 dark:text-rose-400"
                      >
                        {co.coCode} — {co.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : !facultyLoading && facultyList.length > 0 ? (
          <Card className="p-8">
            <EmptyState
              icon={BarChart3}
              title="No analytics data yet"
              subtitle="Analytics will appear here once feedback has been submitted"
            />
          </Card>
        ) : null}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
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
