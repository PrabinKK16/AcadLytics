import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, GraduationCap, Sun, Moon, ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";
import { forgotPassword } from "../../redux/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";

const FieldWrap = ({ hasError, children }) => (
  <div
    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:ring-2
    ${
      hasError
        ? "border-red-400 bg-red-100 focus-within:ring-red-300 dark:border-red-500/50 dark:bg-red-500/10 dark:focus-within:ring-red-500/30"
        : "border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-400/30"
    }`}
  >
    {children}
  </div>
);

const inputCls =
  "w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-white dark:placeholder:text-slate-400";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(forgotPassword(data.email)).unwrap();
      setSubmitted(true);
    } catch (err) {
      toast.error(err || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to login
        </button>
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          {theme === "dark" ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-slate-600" />
          )}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-900/20" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-900/10" />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
              <GraduationCap size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Forgot password?
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20">
                <Send
                  size={28}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                If{" "}
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {getValues("email")}
                </span>{" "}
                is registered, you'll receive a reset link shortly.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check your spam folder if needed. The link expires in 1 hour.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
              >
                Back to Login
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <FieldWrap hasError={!!errors.email}>
                  <Mail size={16} className="flex-shrink-0 text-slate-500" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={inputCls}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </FieldWrap>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
