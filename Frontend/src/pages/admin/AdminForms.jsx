import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Type,
  Hash,
  CalendarClock,
  Plus,
  CheckCircle2,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { Card, SectionHeader } from "../../components/ui/index";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {label}
    </label>
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-amber-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100 dark:border-white/10 dark:bg-white/[0.03] dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20">
      <Icon size={15} className="flex-shrink-0 text-slate-400" />
      {children}
    </div>
  </div>
);

export default function AdminForms() {
  const [form, setForm] = useState({ title: "", course: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post("/admin/feedback-form", form);
      toast.success("Feedback form created");
      setForm({ title: "", course: "", deadline: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader
        title="Create Feedback Form"
        subtitle="Create a new feedback form and link it to a course"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Form Title" icon={Type}>
              <input
                value={form.title}
                onChange={update("title")}
                placeholder="e.g. Mid-Semester Feedback Form"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>
            <Field label="Course ID" icon={Hash}>
              <input
                value={form.course}
                onChange={update("course")}
                placeholder="Paste course MongoDB ObjectId"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>
            <Field label="Deadline (Optional)" icon={CalendarClock}>
              <input
                type="datetime-local"
                value={form.deadline}
                onChange={update("deadline")}
                className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-white dark:[color-scheme:dark]"
              />
            </Field>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Plus size={16} />
                )}
                {loading ? "Creating…" : "Create Form"}
              </button>
              {success && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 size={16} /> Form created!
                </motion.span>
              )}
            </div>
          </form>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/[0.05]"
      >
        <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
          💡 Workflow
        </p>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-500">
          1. Create a course first → 2. Create a feedback form for that course →
          3. Add questions linked to course outcomes.
        </p>
      </motion.div>
    </div>
  );
}
