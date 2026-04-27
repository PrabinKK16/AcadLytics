import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginUser } from "../../redux/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";

/* Explicit dark bg — prevents browser autofill from overriding to white */
const FieldWrap = ({ hasError, children }) => (
  <div
    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:ring-2
    ${
      hasError
        ? "border-red-300 bg-red-50 focus-within:ring-red-200 dark:border-red-500/40 dark:bg-red-500/10 dark:focus-within:ring-red-500/20"
        : "border-slate-200 bg-white focus-within:border-indigo-400 focus-within:ring-indigo-100 dark:border-white/10 dark:bg-[#1e2535] dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-500/20"
    }`}
  >
    {children}
  </div>
);

const inputCls =
  "w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success("Welcome back!");
      const role = result?.role;
      if (role === "student") navigate("/student");
      else if (role === "faculty") navigate("/faculty");
      else if (role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-[#0b0f1a] dark:via-[#0d1117] dark:to-[#0b0f1a]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to home
        </button>
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition dark:border-white/10 dark:bg-[#1e2535]"
        >
          {theme === "dark" ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-slate-500" />
          )}
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
        {/* Blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl dark:bg-violet-900/10" />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md rounded-3xl border border-white/80 bg-white p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#111827]"
        >
          {/* Brand */}
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
              <GraduationCap size={22} className="text-white" />
            </div>
            <h1
              className="text-2xl font-extrabold text-slate-800 dark:text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign in to your AcadLytics account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Email Address
              </label>
              <FieldWrap hasError={!!errors.email}>
                <Mail size={16} className="flex-shrink-0 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                      message: "Invalid email",
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

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </label>
              <FieldWrap hasError={!!errors.password}>
                <Lock size={16} className="flex-shrink-0 text-slate-400" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter password"
                  className={inputCls}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="flex-shrink-0 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </FieldWrap>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
