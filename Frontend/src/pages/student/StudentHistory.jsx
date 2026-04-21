import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, BookOpen, CheckCircle2, Clock } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import {
  Card,
  SectionHeader,
  EmptyState,
  Badge,
} from "../../components/ui/index";

export default function StudentHistory() {
  const [courses, setCourses] = useState([]);
  const [formStatuses, setFormStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await axiosInstance.get("/enrollments/my-courses");
        const c = r.data.data || [];
        setCourses(c);

        // For each course, try to fetch active form to determine status
        const statuses = {};
        await Promise.all(
          c.map(async (course) => {
            try {
              await axiosInstance.get(`/feedback/active/${course._id}`);
              statuses[course._id] = "pending";
            } catch (e) {
              statuses[course._id] =
                e.response?.status === 404 ? "no-form" : "submitted";
            }
          }),
        );
        setFormStatuses(statuses);
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "pending")
      return (
        <Badge variant="amber">
          <Clock size={10} className="mr-1" />
          Pending
        </Badge>
      );
    if (status === "submitted")
      return (
        <Badge variant="emerald">
          <CheckCircle2 size={10} className="mr-1" />
          Submitted
        </Badge>
      );
    return <Badge variant="default">No Form</Badge>;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader
        title="Feedback History"
        subtitle="Track which courses you've submitted feedback for"
      />

      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-0 divide-y divide-slate-100 dark:divide-white/[0.04]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100 dark:bg-white/5" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={History}
            title="No course history"
            subtitle="Your enrolled courses and feedback status will appear here"
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-white/[0.02]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                  <BookOpen
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-sm text-slate-800 dark:text-white">
                    {course.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {course.code} · {course.semester}
                  </p>
                </div>
                <div>{getStatusBadge(formStatuses[course._id])}</div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Summary */}
      {!loading && courses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              {
                label: "Total Courses",
                value: courses.length,
                color: "text-indigo-600 dark:text-indigo-400",
              },
              {
                label: "Pending",
                value: Object.values(formStatuses).filter(
                  (s) => s === "pending",
                ).length,
                color: "text-amber-600 dark:text-amber-400",
              },
              {
                label: "Submitted",
                value: Object.values(formStatuses).filter(
                  (s) => s === "submitted",
                ).length,
                color: "text-emerald-600 dark:text-emerald-400",
              },
            ].map((s) => (
              <Card key={s.label} className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  {s.label}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
