import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Hash,
  Type,
  Layers,
  Plus,
  CheckCircle2,
  ListOrdered,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { Card, SectionHeader } from "../../components/ui/index";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {label}
    </label>
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03] dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-500/20">
      {Icon && <Icon size={15} className="flex-shrink-0 text-slate-400" />}
      {children}
    </div>
  </div>
);

const TYPES = [
  { value: "rating", label: "Rating (1–5)", desc: "Numeric scale question" },
  { value: "mcq", label: "Multiple Choice", desc: "Single-select options" },
  { value: "text", label: "Open Text", desc: "Free-form response" },
];

export default function AdminQuestions() {
  const [form, setForm] = useState({
    form: "",
    text: "",
    type: "rating",
    options: "",
    co: "",
    weightage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post("/admin/question", {
        ...form,
        weightage: Number(form.weightage),
        options:
          form.type === "mcq"
            ? form.options
                .split(",")
                .map((o) => o.trim())
                .filter(Boolean)
            : [],
      });
      toast.success("Question added");
      setForm({
        form: form.form,
        text: "",
        type: "rating",
        options: "",
        co: "",
        weightage: 1,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader
        title="Add Question"
        subtitle="Add a question to an existing feedback form, linked to a CO"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Form ID" icon={Hash}>
              <input
                value={form.form}
                onChange={update("form")}
                placeholder="Feedback form ObjectId"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Question Text
              </label>
              <textarea
                value={form.text}
                onChange={update("text")}
                placeholder="Enter the question for students…"
                required
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-white placeholder:text-slate-400"
              />
            </div>

            {/* Type selector */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Question Type
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t.value }))}
                    className={`rounded-xl border p-3 text-left transition-all ${form.type === t.value ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/10" : "border-slate-200 bg-slate-50 hover:border-indigo-200 dark:border-white/10 dark:bg-white/[0.03]"}`}
                  >
                    <p className="text-xs font-bold text-slate-700 dark:text-white">
                      {t.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      {t.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* MCQ options */}
            <AnimatePresence>
              {form.type === "mcq" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Field
                    label="MCQ Options (comma-separated)"
                    icon={ListOrdered}
                  >
                    <input
                      value={form.options}
                      onChange={update("options")}
                      placeholder="Option A, Option B, Option C"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            <Field label="Course Outcome ID" icon={Layers}>
              <input
                value={form.co}
                onChange={update("co")}
                placeholder="CourseOutcome ObjectId"
                required
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </Field>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Weightage
              </label>
              <input
                type="number"
                min={1}
                value={form.weightage}
                onChange={update("weightage")}
                className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Plus size={16} />
                )}
                {loading ? "Adding…" : "Add Question"}
              </button>
              {success && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 size={16} /> Question added!
                </motion.span>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
