import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFacultyTrend,
  fetchCourseAnalytics,
} from "../../redux/slices/dashboardSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Brain,
  Sparkles,
  TrendingUp,
  BarChart3,
  Send,
  AlertTriangle,
  ChevronDown,
  BookOpen,
} from "lucide-react";
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
  Cell,
} from "recharts";
import { ChartTooltip } from "../../components/charts/ChartTooltip";
import {
  Card,
  SectionHeader,
  EmptyState,
  LevelBadge,
  Skeleton,
} from "../../components/ui/index";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const LEVEL_COLORS = { High: "#10b981", Medium: "#f59e0b", Low: "#ef4444" };

export default function FacultyAnalytics() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { facultyTrend, courseAnalytics, loading } = useSelector(
    (s) => s.dashboard,
  );

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Derive unique courses from facultyTrend
  const courseList = facultyTrend
    ? Object.values(
        facultyTrend.reduce((acc, t) => {
          if (t.course && !acc[t.course]) {
            acc[t.course] = {
              id: t.course,
              code: t.courseCode || t.course,
              name: t.courseName || t.courseCode || "Unknown",
            };
          }
          return acc;
        }, {}),
      )
    : [];

  const selectedCourse =
    courseList.find((c) => c.id === selectedCourseId) || courseList[0];

  useEffect(() => {
    if (!user) return;
    dispatch(fetchFacultyTrend(user._id));
  }, [dispatch, user]);

  useEffect(() => {
    if (facultyTrend?.length > 0 && !selectedCourseId) {
      const firstId = facultyTrend[0].course;
      setSelectedCourseId(firstId);
      dispatch(fetchCourseAnalytics(firstId));
    }
  }, [dispatch, facultyTrend, selectedCourseId]);

  const handleCourseChange = useCallback(
    (courseId) => {
      setSelectedCourseId(courseId);
      dispatch(fetchCourseAnalytics(courseId));
      setDropdownOpen(false);
    },
    [dispatch],
  );

  const courseTrend =
    facultyTrend?.filter(
      (t) => t.course === (selectedCourseId || courseList[0]?.id),
    ) || [];

  const handleExportCSV = async () => {
    const courseId = selectedCourseId || courseList[0]?.id;
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
      a.download = `analytics-${selectedCourse?.code || courseId}.csv`;
      a.click();
      toast.success("CSV exported");
    } catch {
      toast.error("Export failed");
    }
  };

  const weakAreas =
    courseAnalytics?.coAttainment?.filter((co) => co.level === "Low") || [];

  const statCards = [
    {
      title: "Average Score",
      value: courseAnalytics?.averageScore?.toFixed(1) ?? "—",
      icon: BarChart3,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      border: "border-violet-100 dark:border-violet-500/20",
    },
    {
      title: "Total Submissions",
      value: courseAnalytics?.totalSubmissions ?? "—",
      icon: Send,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-100 dark:border-indigo-500/20",
    },
    {
      title: "Semester Snapshots",
      value: courseTrend?.length || 0,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-500/20",
    },
    {
      title: "Weak COs",
      value: weakAreas.length,
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics"
        subtitle="Detailed course performance and CO attainment analysis"
        action={
          <div className="flex items-center gap-3">
            {courseList.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 dark:border-white/10 dark:bg-[#111827] dark:text-white dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10"
                >
                  <BookOpen size={14} className="text-violet-500" />
                  {selectedCourse?.code || "Select Course"}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.13 }}
                      className="absolute right-0 z-50 mt-2 min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a2234]"
                    >
                      {courseList.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleCourseChange(c.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-violet-50 dark:hover:bg-violet-500/10 ${
                            c.id === selectedCourseId
                              ? "bg-violet-50 font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                            {c.code?.[0] || "C"}
                          </span>
                          <div>
                            <p className="font-medium">{c.code}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {c.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        }
      />

      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-violet-200/60 bg-violet-50/60 px-4 py-2.5 dark:border-violet-500/20 dark:bg-violet-500/[0.06]"
        >
          <BookOpen
            size={14}
            className="text-violet-600 dark:text-violet-400"
          />
          <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
            {selectedCourse.code}
          </span>
          {selectedCourse.name !== selectedCourse.code && (
            <span className="text-sm text-violet-500 dark:text-violet-400">
              — {selectedCourse.name}
            </span>
          )}
          <span className="ml-auto text-xs text-violet-400 dark:text-violet-500">
            {courseTrend.length} semester{courseTrend.length !== 1 ? "s" : ""}{" "}
            of data
          </span>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s, i) => {
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
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <Card className="p-6">
          <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-white">
            Score Trend{selectedCourse ? ` — ${selectedCourse.code}` : ""}
          </h3>
          <p className="mb-5 text-xs text-slate-400 dark:text-slate-500">
            Average score progression across semesters for this course
          </p>
          {loading && !courseTrend.length ? (
            <Skeleton className="h-72" />
          ) : !courseTrend.length ? (
            <EmptyState
              icon={TrendingUp}
              title="No trend data"
              subtitle="No semester snapshots for this course yet"
            />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={courseTrend}
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.33 }}
      >
        <Card className="p-6">
          <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-white">
            Course Outcome Attainment
          </h3>
          <p className="mb-5 text-xs text-slate-400 dark:text-slate-500">
            Attainment % per CO with level classification
          </p>
          {loading ? (
            <Skeleton className="h-72" />
          ) : !courseAnalytics?.coAttainment?.length ? (
            <EmptyState
              icon={BarChart3}
              title="No CO data yet"
              subtitle="Submit feedback to see CO attainment"
            />
          ) : (
            <>
              <div className="h-64">
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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        CO
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Level
                      </th>
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
                        <td className="max-w-xs truncate px-4 py-3 text-slate-500 dark:text-slate-400">
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
            </>
          )}
        </Card>
      </motion.div>

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
        >
          <div className="rounded-2xl border border-rose-200/60 bg-rose-50/70 p-5 dark:border-rose-500/20 dark:bg-rose-500/[0.05]">
            <div className="mb-3 flex items-center gap-2.5">
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
    </div>
  );
}
