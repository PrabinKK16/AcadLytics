import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Sun, Moon, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { verifyOTP } from "../../redux/slices/authSlice";
import { useTheme } from "../../context/ThemeContext";

export default function VerifyOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, pendingEmail } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!pendingEmail) {
      const stored = localStorage.getItem("pendingEmail");
      if (!stored) {
        navigate("/login", { replace: true });
      }
    }
  }, [pendingEmail, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(
        verifyOTP({ email: pendingEmail, otp: data.otp }),
      ).unwrap();

      toast.success("Welcome back!");

      const role = result?.user?.role || result?.role;
      if (role === "student") navigate("/student");
      else if (role === "faculty") navigate("/faculty");
      else if (role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Invalid OTP");
    }
  };

  if (!pendingEmail) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-end px-5 py-4">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white shadow-sm transition dark:border-slate-700 dark:bg-slate-800"
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
              <ShieldCheck size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Check your email
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              We sent a 6-digit OTP to{" "}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {pendingEmail}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                One-time password
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className={`w-full rounded-xl border px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none transition
                ${
                  errors.otp
                    ? "border-red-400 bg-red-100 dark:border-red-500/50 dark:bg-red-500/10"
                    : "border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/30"
                } text-slate-900 dark:text-white`}
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "OTP must be 6 digits",
                  },
                })}
              />
              {errors.otp && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.otp.message}
                </p>
              )}
              <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                OTP expires in 5 minutes
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
            Wrong account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Go back
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
