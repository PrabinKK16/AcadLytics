import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-indigo-50/40 to-violet-50/30">
    <div className="absolute -top-40 -left-40 h-150 w-150 rounded-full bg-indigo-200/30 blur-3xl" />
    <div className="absolute -bottom-40 -right-40 h-150 w-150 rounded-full bg-violet-200/30 blur-3xl" />
    <div className="absolute top-1/2 left-1/3 h-72 w-72 rounded-full bg-pink-100/40 blur-3xl" />

    <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center px-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span
              className="text-2xl font-bold text-slate-800"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              AcadLytics
            </span>
          </div>
          <h1
            className="text-5xl font-extrabold text-slate-800 leading-tight"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Smart Academic
            <br />
            <span className="text-indigo-600">Intelligence</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-md leading-relaxed">
            CO attainment analytics, faculty insights, trend dashboards, and
            automated academic reporting — all in one platform.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {["CO Analytics", "Faculty Trends", "AI Insights"].map((f) => (
              <div
                key={f}
                className="rounded-2xl border border-indigo-100 bg-white/60 px-4 py-3 backdrop-blur-sm text-center"
              >
                <p className="text-xs font-semibold text-indigo-600">{f}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-3xl border border-white/80 bg-white/80 p-8 shadow-2xl shadow-slate-200/80 backdrop-blur-xl"
        >
          <div className="mb-7">
            <h2
              className="text-2xl font-bold text-slate-800"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
