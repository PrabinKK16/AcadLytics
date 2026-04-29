import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../../redux/slices/authSlice";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    dispatch(verifyEmail(token))
      .unwrap()
      .then((msg) => {
        setStatus("success");
        setMessage(msg || "Email verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err || "Invalid or expired verification link.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-5">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-900/20" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-900/10" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900 text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
            <GraduationCap size={22} className="text-white" />
          </div>
        </div>

        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 size={40} className="animate-spin text-indigo-600" />
            <p className="text-slate-600 dark:text-slate-300">
              Verifying your email…
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
              <CheckCircle
                size={36}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Email verified!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {message}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
            >
              Go to Login
            </motion.button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
              <XCircle size={36} className="text-red-500 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Verification failed
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {message}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The link may have expired. Sign up again to get a new link.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
            >
              Back to Signup
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
