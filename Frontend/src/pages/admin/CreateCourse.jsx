import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Hash, Calendar, User } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400">
      {label}
    </label>
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 dark:border-white/10 dark:bg-white/3 dark:focus-within:border-indigo-500">
      <Icon size={16} className="text-slate-400 shrink-0" />
      {children}
    </div>
  </div>
);

const CreateCourse = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    semester: "",
    faculty: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post("/admin/course", form);
      toast.success("Course created successfully");
      setForm({ name: "", code: "", semester: "", faculty: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Course creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-xl font-bold text-slate-800 dark:text-white"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Create Course
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add a new course to the system
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-5 dark:border-white/6 dark:bg-[#111827]"
      >
        <Field label="Course Name" icon={BookOpen}>
          <input
            placeholder="e.g. Data Structures"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-white placeholder:text-slate-400"
          />
        </Field>
        <Field label="Course Code" icon={Hash}>
          <input
            placeholder="e.g. CS301"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-white placeholder:text-slate-400"
          />
        </Field>
        <Field label="Semester" icon={Calendar}>
          <input
            placeholder="e.g. Fall 2024"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
            className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-white placeholder:text-slate-400"
          />
        </Field>
        <Field label="Faculty User ID" icon={User}>
          <input
            placeholder="Enter faculty ID"
            value={form.faculty}
            onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-white placeholder:text-slate-400"
          />
        </Field>
        <button
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:opacity-60 mt-1"
        >
          {loading ? "Creating…" : "Create Course"}
        </button>
      </motion.form>
    </div>
  );
};

export default CreateCourse;
