import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, GraduationCap, Sun, Moon } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { resetPassword } from "../../redux/slices/authSlice";
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

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();

  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const pw = watch("password");

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Invalid reset link. Please request a new one.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(
        resetPassword({ token, password: data.password }),
      ).unwrap();
      toast.success("Password reset! Please log in with your new password.");
      navigate("/login");
    } catch (err) {
      toast.error(err || "Reset failed. The link may have expired.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-end px-5 py-4">
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
              Set new password
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Choose a strong password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                New Password
              </label>
              <FieldWrap hasError={!!errors.password}>
                <Lock size={16} className="flex-shrink-0 text-slate-500" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  className={inputCls}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="flex-shrink-0 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
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

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Confirm Password
              </label>
              <FieldWrap hasError={!!errors.confirmPassword}>
                <Lock size={16} className="flex-shrink-0 text-slate-500" />
                <input
                  type={showCpw ? "text" : "password"}
                  placeholder="Repeat your password"
                  className={inputCls}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (v) => v === pw || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowCpw((p) => !p)}
                  className="flex-shrink-0 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </FieldWrap>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Resetting…" : "Reset Password"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
