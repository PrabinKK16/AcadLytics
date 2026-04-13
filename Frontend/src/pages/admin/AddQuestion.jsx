import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const AddQuestion = () => {
  const [form, setForm] = useState({
    form: "",
    text: "",
    type: "rating",
    options: "",
    co: "",
    weightage: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/admin/question", {
        ...form,
        options:
          form.type === "mcq"
            ? form.options.split(",").map((item) => item.trim())
            : [],
      });

      toast.success("Question added successfully");

      setForm({
        form: "",
        text: "",
        type: "rating",
        options: "",
        co: "",
        weightage: 1,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Question add failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <h1 className="text-2xl font-bold">Add Question</h1>

      <input
        placeholder="Form ID"
        value={form.form}
        onChange={(e) => setForm({ ...form, form: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <textarea
        placeholder="Question text"
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full rounded-2xl border p-4"
      >
        <option value="rating">Rating</option>
        <option value="mcq">MCQ</option>
        <option value="text">Text</option>
      </select>

      {form.type === "mcq" && (
        <input
          placeholder="Option1, Option2, Option3"
          value={form.options}
          onChange={(e) => setForm({ ...form, options: e.target.value })}
          className="w-full rounded-2xl border p-4"
        />
      )}

      <input
        placeholder="CO ID"
        value={form.co}
        onChange={(e) => setForm({ ...form, co: e.target.value })}
        className="w-full rounded-2xl border p-4"
      />

      <input
        type="number"
        placeholder="Weightage"
        value={form.weightage}
        onChange={(e) =>
          setForm({ ...form, weightage: Number(e.target.value) })
        }
        className="w-full rounded-2xl border p-4"
      />

      <button className="rounded-2xl bg-indigo-600 px-6 py-3 text-white">
        Add Question
      </button>
    </form>
  );
};

export default AddQuestion;
