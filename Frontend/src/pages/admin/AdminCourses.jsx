import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Hash,
  Calendar,
  User,
  Plus,
  CheckCircle2,
  Layers,
  Trash2,
  AlertTriangle,
  X,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { Card, SectionHeader } from "../../components/ui/index";

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

function DeleteModal({ course, onConfirm, onCancel, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#1a2234]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-500/15">
            <AlertTriangle
              size={18}
              className="text-rose-600 dark:text-rose-400"
            />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Delete Subject
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This action cannot be undone
            </p>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-800 dark:text-white">
            {course?.name} ({course?.code})
          </span>
          ? All associated feedback forms and questions will also be removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Trash2 size={14} />
            )}
            {loading ? "Deleting…" : "Delete Subject"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminCourses() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    semester: "",
    faculty: "",
  });
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [facultyList, setFacultyList] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const fetchSubjects = async () => {
    setSubjectsLoading(true);
    try {
      const res = await axiosInstance.get("/admin/subjects");
      setSubjects(res.data?.data || []);
    } catch {
      toast.error("Could not load subjects");
    } finally {
      setSubjectsLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const res = await axiosInstance.get("/profile/faculty");
      const list = res.data?.data || [];
      setFacultyList(list);
      if (list.length > 0) {
        setForm((p) => ({ ...p, faculty: list[0]._id }));
      }
    } catch {
      toast.error("Could not load faculty list");
    } finally {
      setFacultyLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchFaculty();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const semesterNum = parseInt(form.semester, 10);
    if (!Number.isInteger(semesterNum) || semesterNum < 1 || semesterNum > 12) {
      toast.error("Semester must be a number between 1 and 12");
      return;
    }

    try {
      setCreating(true);
      await axiosInstance.post("/admin/course", {
        ...form,
        semester: semesterNum,
      });
      toast.success("Course created successfully");
      setForm({
        name: "",
        code: "",
        semester: "",
        faculty: facultyList[0]?._id || "",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Course creation failed");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/subjects/${deleteTarget._id}`);
      toast.success(`${deleteTarget.name} deleted`);
      setSubjects((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.faculty?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
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

              <Field label="Semester (1–12)" icon={Calendar}>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={form.semester}
                  onChange={update("semester")}
                  placeholder="e.g. 4"
                  required
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </Field>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Faculty
                </label>
                <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03]">
                  <User size={15} className="flex-shrink-0 text-slate-400" />
                  {facultyLoading ? (
                    <span className="text-sm text-slate-400">
                      Loading faculty…
                    </span>
                  ) : facultyList.length === 0 ? (
                    <span className="text-sm text-rose-500">
                      No faculty available. Add faculty accounts first.
                    </span>
                  ) : (
                    <select
                      value={form.faculty}
                      onChange={update("faculty")}
                      required
                      className="w-full appearance-none bg-transparent text-sm text-slate-700 outline-none dark:text-white"
                    >
                      {facultyList.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name} — {f.email}
                        </option>
                      ))}
                    </select>
                  )}
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-4 text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={creating || facultyList.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {creating ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {creating ? "Creating…" : "Create Course"}
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-rose-500" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Manage Subjects
              </h2>
            </div>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {subjects.length} subject{subjects.length !== 1 ? "s" : ""}{" "}
              registered
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <Hash size={14} className="text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects…"
                className="w-40 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>
            <button
              onClick={fetchSubjects}
              disabled={subjectsLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400"
              title="Refresh"
            >
              <RefreshCw
                size={14}
                className={subjectsLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          {subjectsLoading ? (
            <div className="space-y-0">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-slate-100 p-4 dark:border-white/[0.05]"
                >
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.05]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 animate-pulse rounded bg-slate-100 dark:bg-white/[0.05]" />
                    <div className="h-2.5 w-24 animate-pulse rounded bg-slate-100 dark:bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.05]">
                <BookOpen size={22} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? "No subjects match your search"
                  : "No subjects yet"}
              </p>
              {!searchQuery && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Create a course above to get started
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  #
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Subject
                </span>
                <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:block">
                  Code
                </span>
                <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 md:block">
                  Faculty
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Action
                </span>
              </div>
              <AnimatePresence initial={false}>
                {filteredSubjects.map((subject, idx) => (
                  <motion.div
                    key={subject._id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 dark:border-white/[0.04] dark:hover:bg-white/[0.02]"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {subject.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Semester: {subject.semester}
                      </p>
                    </div>
                    <span className="hidden rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 sm:block">
                      {subject.code}
                    </span>
                    <span className="hidden max-w-[140px] truncate text-xs text-slate-500 dark:text-slate-400 md:block">
                      {subject.faculty?.name || "—"}
                    </span>
                    <button
                      onClick={() => setDeleteTarget(subject)}
                      className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </motion.div>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            course={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
