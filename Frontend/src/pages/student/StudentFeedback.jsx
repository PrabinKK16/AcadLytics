import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  ChevronDown,
  Star,
  CheckCircle2,
  BookOpen,
  ClipboardX,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { Card, SectionHeader, EmptyState } from "../../components/ui/index";

const RatingButton = ({ num, selected, onClick }) => (
  <button
    onClick={() => onClick(num)}
    className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl font-bold text-sm transition-all ${
      selected
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-110"
        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
    }`}
  >
    {num}
    {selected && (
      <span className="absolute -top-1.5 -right-1.5">
        <Star size={10} className="fill-amber-400 text-amber-400" />
      </span>
    )}
  </button>
);

export default function StudentFeedback() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/enrollments/my-courses")
      .then((r) => {
        const c = r.data.data || [];
        setCourses(c);
        if (c.length) setSelectedCourse(c[0]._id);
      })
      .catch(() => toast.error("Failed to load courses"));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoadingForm(true);
    setFormData(null);
    setAnswers({});
    setSubmitted(false);
    axiosInstance
      .get(`/feedback/active/${selectedCourse}`)
      .then((r) => setFormData(r.data.data))
      .catch((e) => {
        setFormData(null);
        if (e.response?.status !== 404)
          toast.error(e.response?.data?.message || "No active form");
      })
      .finally(() => setLoadingForm(false));
  }, [selectedCourse]);

  const handleChange = (qId, val) => setAnswers((p) => ({ ...p, [qId]: val }));

  const handleSubmit = async () => {
    if (!formData?.form?._id) return;
    const responses = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value: typeof value === "string" && !isNaN(value) ? Number(value) : value,
    }));
    try {
      setLoading(true);
      await axiosInstance.post("/feedback/submit", {
        formId: formData.form._id,
        courseId: selectedCourse,
        responses,
      });
      toast.success("Feedback submitted successfully!");
      setSubmitted(true);
      setAnswers({});
    } catch (e) {
      toast.error(e.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader
        title="Submit Feedback"
        subtitle="Share your course experience to help improve teaching quality"
      />

      {/* Course selector */}
      <Card className="mb-5 p-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Select Course
        </label>
        <div className="relative">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:[color-scheme:dark]"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-3 text-slate-400"
          />
        </div>
      </Card>

      {/* Loading */}
      {loadingForm && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5"
            />
          ))}
        </div>
      )}

      {/* Success state */}
      {submitted && !loadingForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
              <CheckCircle2
                size={32}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Feedback Submitted!
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Thank you for your valuable feedback.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
            >
              Submit another
            </button>
          </Card>
        </motion.div>
      )}

      {/* No form */}
      {!loadingForm && !formData && !submitted && (
        <Card className="p-6">
          <EmptyState
            icon={ClipboardX}
            title="No active feedback form"
            subtitle="No feedback form is currently open for this course. Check back later."
          />
        </Card>
      )}

      {/* Form */}
      {!loadingForm && formData && !submitted && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-5 rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 dark:border-indigo-500/20 dark:from-indigo-500/[0.08] dark:to-violet-500/[0.05]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-white">
                    {formData.form.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formData.questions.length} questions ·{" "}
                    {courses.find((c) => c._id === selectedCourse)?.code}
                  </p>
                </div>
              </div>
              {formData.form.deadline && (
                <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">
                  Deadline: {new Date(formData.form.deadline).toLocaleString()}
                </p>
              )}
            </div>
          </motion.div>

          <div className="space-y-4">
            {formData.questions.map((q, i) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-5">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">
                        {q.text}
                      </p>
                      {q.co && (
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          CO: {q.co.code}
                        </p>
                      )}
                    </div>
                  </div>

                  {q.type === "rating" && (
                    <div className="flex flex-wrap gap-2.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <RatingButton
                          key={n}
                          num={n}
                          selected={answers[q._id] === n}
                          onClick={(v) => handleChange(q._id, v)}
                        />
                      ))}
                    </div>
                  )}

                  {q.type === "mcq" && (
                    <div className="space-y-2.5">
                      {q.options.map((opt) => (
                        <label
                          key={opt}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${answers[q._id] === opt ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10" : "border-slate-200 bg-slate-50 hover:border-indigo-200 dark:border-white/10 dark:bg-white/[0.03]"}`}
                        >
                          <input
                            type="radio"
                            name={q._id}
                            value={opt}
                            onChange={(e) =>
                              handleChange(q._id, e.target.value)
                            }
                            className="accent-indigo-600"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === "text" && (
                    <textarea
                      rows={3}
                      placeholder="Share your thoughts…"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                      onChange={(e) => handleChange(q._id, e.target.value)}
                      value={answers[q._id] || ""}
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send size={16} />
              )}
              {loading ? "Submitting…" : "Submit Feedback"}
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}
