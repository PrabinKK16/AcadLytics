import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  fetchUnreadCount,
} from "../../redux/slices/dashboardSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { SectionHeader, Card, EmptyState } from "../../components/ui/index";
import axiosInstance from "../../services/axiosInstance";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, type: "spring", stiffness: 300, damping: 25 },
});

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { notifications, unreadCount } = useSelector((s) => s.dashboard);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchUnreadCount());
    axiosInstance
      .get("/enrollments/my-courses")
      .then((r) => setCourses(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, [dispatch]);

  const stats = [
    {
      title: "Enrolled Courses",
      value: courses.length,
      icon: BookOpen,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-100 dark:border-indigo-500/20",
      to: "/student/feedback",
    },
    {
      title: "Unread Alerts",
      value: unreadCount,
      icon: Bell,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-500/20",
      to: "/student/notifications",
    },
    {
      title: "Total Notifications",
      value: notifications.length,
      icon: ClipboardList,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-500/20",
      to: "/student/notifications",
    },
    {
      title: "Feedback Pending",
      value: courses.length,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
      to: "/student/feedback",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Hello, ${user?.name?.split(" ")[0]} 👋`}
        subtitle="Here's your academic activity overview"
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={s.title}
              {...fadeUp(i * 0.07)}
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
                {loadingCourses && s.title === "Enrolled Courses"
                  ? "…"
                  : s.value}
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 group-hover:text-indigo-500 transition-colors dark:text-slate-500">
                View details <ArrowRight size={11} />
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Enrolled courses */}
      <motion.div {...fadeUp(0.3)}>
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              Your Enrolled Courses
            </h3>
            <button
              onClick={() => navigate("/student/feedback")}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400"
            >
              Submit Feedback <ArrowRight size={11} />
            </button>
          </div>
          {loadingCourses ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5"
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              subtitle="You'll see enrolled courses here once assigned"
            />
          ) : (
            <div className="space-y-2.5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5 transition hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/10">
                      <BookOpen
                        size={15}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-white">
                        {course.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {course.code} · {course.semester}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/student/feedback")}
                    className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    Give Feedback <ArrowRight size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Recent notifications */}
      <motion.div {...fadeUp(0.35)}>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              Recent Notifications
            </h3>
            <button
              onClick={() => navigate("/student/notifications")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View all
            </button>
          </div>
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              subtitle="You'll see updates here"
            />
          ) : (
            <div className="space-y-2.5">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n._id}
                  className={`rounded-xl px-4 py-3 text-sm ${n.isRead ? "bg-slate-50 text-slate-500 dark:bg-white/[0.03] dark:text-slate-400" : "bg-indigo-50 font-medium text-slate-700 dark:bg-indigo-500/[0.08] dark:text-slate-200"}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && (
                      <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
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
  );
}
