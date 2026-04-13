import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const FeedbackForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // fetch enrolled courses once
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/enrollments/my-courses");

        const fetchedCourses = response.data.data;
        setCourses(fetchedCourses);

        if (fetchedCourses.length) {
          setSelectedCourse(fetchedCourses[0]._id);
        }
      } catch (error) {
        toast.error("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  // fetch active form whenever selected course changes
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchForm = async () => {
      try {
        const response = await axiosInstance.get(
          `/feedback/active/${selectedCourse}`,
        );

        setFormData(response.data.data);
        setAnswers({});
      } catch (error) {
        setFormData(null);
        toast.error(
          error.response?.data?.message || "No active form available",
        );
      }
    };

    fetchForm();
  }, [selectedCourse]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

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

      toast.success("Feedback submitted successfully");
      setAnswers({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* course selector */}
      <div
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
      dark:border-white/10 dark:bg-slate-900"
      >
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Select Course
        </label>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 
          outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 
          dark:bg-slate-800 dark:text-white"
        >
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.code} — {course.name}
            </option>
          ))}
        </select>
      </div>

      {!formData ? (
        <div
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
        dark:border-white/10 dark:bg-slate-900"
        >
          No active feedback form available
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
            dark:border-white/10 dark:bg-slate-900"
          >
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {formData.form.title}
            </h1>
          </motion.div>

          {formData.questions.map((question, index) => (
            <motion.div
              key={question._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 
              shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <p className="mb-4 font-medium text-slate-800 dark:text-white">
                {index + 1}. {question.text}
              </p>

              {question.type === "rating" && (
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleChange(question._id, num)}
                      className={`h-12 w-12 rounded-2xl border ${
                        answers[question._id] === num
                          ? "bg-indigo-600 text-white"
                          : "border-slate-200 dark:border-white/10"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              {question.type === "mcq" && (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        onChange={(e) =>
                          handleChange(question._id, e.target.value)
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {question.type === "text" && (
                <textarea
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:ring-2 
                  focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  onChange={(e) => handleChange(question._id, e.target.value)}
                />
              )}
            </motion.div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-medium 
            text-white hover:bg-indigo-700"
          >
            <Send size={18} />
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </>
      )}
    </div>
  );
};

export default FeedbackForm;
