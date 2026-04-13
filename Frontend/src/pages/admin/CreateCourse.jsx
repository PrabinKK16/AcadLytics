import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const CreateCourse = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    semester: "",
    faculty: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/admin/course", form);
      toast.success("Course created successfully");

      setForm({
        name: "",
        code: "",
        semester: "",
        faculty: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Course creation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <h1 className="text-2xl font-bold">Create Course</h1>

      <input
        placeholder="Course Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <input
        placeholder="Course Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <input
        placeholder="Semester"
        value={form.semester}
        onChange={(e) => setForm({ ...form, semester: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <input
        placeholder="Faculty User ID"
        value={form.faculty}
        onChange={(e) => setForm({ ...form, faculty: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <button className="rounded-2xl bg-indigo-600 px-6 py-3 text-white">
        Create Course
      </button>
    </form>
  );
};

export default CreateCourse;
