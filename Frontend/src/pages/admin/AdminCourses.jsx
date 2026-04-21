import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Hash,
  Calendar,
  User,
  Plus,
  CheckCircle2,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { Card, SectionHeader, Input, Button } from "../../components/ui/index";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {label}
    </label>
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03] dark:focus-within:border-rose-500 dark:focus-within:ring-rose-500/20">
      <Icon size={15} className="flex-shrink-0 text-slate-400" />
      {children}
    </div>
  </div>
);

export default function AdminCourses() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    semester: "",
    faculty: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post("/admin/course", form);
      toast.success("Course created successfully");
      setForm({ name: "", code: "", semester: "", faculty: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Course creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader
        title="Create Course"
        subtitle="Add a new course and assign it to a faculty member"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Course Name" icon={BookOpen}>
              <input
                value={form.name}
                onChange={update("name")}
                placeholder="e.g. Data Structures & Algorithms"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>
            <Field label="Course Code" icon={Hash}>
              <input
                value={form.code}
                onChange={update("code")}
                placeholder="e.g. CS301"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>
            <Field label="Semester" icon={Calendar}>
              <input
                value={form.semester}
                onChange={update("semester")}
                placeholder="e.g. Fall 2024"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>
            <Field label="Faculty User ID" icon={User}>
              <input
                value={form.faculty}
                onChange={update("faculty")}
                placeholder="Paste faculty MongoDB user ID"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Plus size={16} />
                )}
                {loading ? "Creating…" : "Create Course"}
              </button>
              {success && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 size={16} /> Created successfully!
                </motion.span>
              )}
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/[0.05]"
      >
        <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
          💡 Tip
        </p>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-500">
          The Faculty User ID must be a valid MongoDB ObjectId of a user with
          the{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-500/10">
            faculty
          </code>{" "}
          role. You can find it from your database.
        </p>
      </motion.div>
    </div>
  );
}
