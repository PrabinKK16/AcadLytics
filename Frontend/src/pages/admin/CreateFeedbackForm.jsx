import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const CreateFeedbackForm = () => {
  const [form, setForm] = useState({
    title: "",
    course: "",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/admin/feedback-form", form);
      toast.success("Feedback form created");

      setForm({
        title: "",
        course: "",
        deadline: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <h1 className="text-2xl font-bold">Create Feedback Form</h1>

      <input
        placeholder="Form Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <input
        placeholder="Course ID"
        value={form.course}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <input
        type="datetime-local"
        value={form.deadline}
        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <button className="rounded-2xl bg-indigo-600 px-6 py-3 text-white">
        Create Form
      </button>
    </form>
  );
};

export default CreateFeedbackForm;
