import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import {
  GraduationCap,
  BarChart3,
  Brain,
  Bell,
  Users,
  BookOpen,
  ChevronRight,
  Sun,
  Moon,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const features = [
  {
    icon: BarChart3,
    title: "CO Attainment Analytics",
    desc: "Real-time course outcome attainment tracking mapped to feedback responses with weighted scoring.",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    icon: Brain,
    title: "AI-Generated Insights",
    desc: "Automated intelligent recommendations from student feedback patterns to improve teaching quality.",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  {
    icon: TrendingUp,
    title: "Faculty Trend Analysis",
    desc: "Semester-over-semester performance tracking with trend visualizations and score breakdowns.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    icon: ClipboardList,
    title: "Smart Feedback Forms",
    desc: "Dynamic multi-type questionnaires (rating, MCQ, text) linked to course outcomes and weightage.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-500/10",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    desc: "Role-aware notifications for submissions, form assignments, and system-wide announcements.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    desc: "Separate, secure dashboards for students, faculty, and admins with strict access control.",
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
  },
];

const roles = [
  {
    role: "Student",
    roleParam: "student",
    icon: Users,
    gradient: "from-indigo-500 to-violet-500",
    border: "border-slate-200/80 dark:border-white/[0.06]",
    btnClass:
      "border border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200",
    perks: [
      "Submit course feedback forms",
      "Track submission history",
      "View pending feedback requests",
      "Receive personal notifications",
    ],
  },
  {
    role: "Faculty",
    roleParam: "faculty",
    icon: BarChart3,
    gradient: "from-violet-500 to-purple-600",
    border:
      "border-violet-200 ring-2 ring-violet-200/60 dark:border-violet-500/30 dark:ring-violet-500/20",
    btnClass:
      "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    featured: true,
    perks: [
      "Course-wise analytics dashboard",
      "CO attainment heatmaps",
      "Semester trend comparison",
      "Export CSV reports",
    ],
  },
  {
    role: "Admin",
    roleParam: "admin",
    icon: ShieldCheck,
    gradient: "from-rose-500 to-pink-600",
    border: "border-slate-200/80 dark:border-white/[0.06]",
    btnClass:
      "border border-slate-200 bg-slate-50 text-slate-700 hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200",
    perks: [
      "Manage courses & feedback forms",
      "Add questions to forms",
      "System-wide notifications",
      "Institution analytics oversight",
    ],
  },
];

const stats = [
  { value: "3", label: "Distinct Role Dashboards" },
  { value: "CO", label: "Outcome Mapped Analytics" },
  { value: "AI", label: "Powered Smart Insights" },
  { value: "CSV", label: "One-Click Data Exports" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  /* Navigate to /signup with role pre-selected via query param */
  const goSignup = (role) =>
    navigate(role ? `/signup?role=${role}` : "/signup");

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900 dark:bg-[#0b0f1a] dark:text-white">
      {/* ── Navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0b0f1a]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/30">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span
              className="text-base font-bold text-slate-800 dark:text-white"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              AcadLytics
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "For Roles", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 dark:border-white/10 dark:bg-[#1e2535]"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-slate-500" />
              )}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-[#1e2535] dark:text-slate-200"
            >
              Log in
            </button>
            <button
              onClick={() => goSignup()}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute -top-60 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-900/20" />
        <div className="absolute top-20 -right-40 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl dark:bg-violet-900/15" />
        <div className="absolute -bottom-20 -left-40 h-80 w-80 rounded-full bg-rose-100/40 blur-3xl dark:bg-rose-900/10" />

        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <motion.div {...fadeUp(0)}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles size={12} /> Academic Intelligence Platform
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white md:text-7xl"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Smart feedback analytics
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              for academic excellence
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.15)}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400"
          >
            AcadLytics transforms raw student feedback into actionable CO
            attainment analytics, faculty trend insights, and AI-powered
            recommendations — all in one platform.
          </motion.p>

          <motion.div
            {...fadeUp(0.22)}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <button
              onClick={() => goSignup()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/30 transition hover:bg-indigo-700"
            >
              Start for free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              Log in to your account <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* Stats band */}
        <motion.div {...fadeUp(0.3)} className="mx-auto mt-20 max-w-4xl px-5">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03] md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section id="features" className="bg-slate-50/80 py-24 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-7xl px-5">
          <motion.div {...fadeUp()} className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Platform Features
            </span>
            <h2
              className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Everything you need, built in
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
              A complete academic analytics suite designed for modern
              institutions.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} {...fadeUp(i * 0.06)}>
                  <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.06] dark:bg-[#111827]">
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.bg}`}
                    >
                      <Icon size={20} className={f.color} />
                    </div>
                    <h3 className="mb-2 font-bold text-slate-800 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── For Roles ───────────────────────────── */}
      <section id="for-roles" className="py-24">
        <div className="mx-auto max-w-7xl px-5">
          <motion.div {...fadeUp()} className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Role-Based Dashboards
            </span>
            <h2
              className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Tailored for every role
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
              Students, faculty, and admins each get a dedicated dashboard
              designed around their workflow.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {roles.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div key={r.role} {...fadeUp(i * 0.08)}>
                  <div
                    className={`relative h-full rounded-2xl border bg-white p-7 shadow-sm transition-all hover:shadow-lg dark:bg-[#111827] ${r.border}`}
                  >
                    {r.featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                        Most Used
                      </span>
                    )}
                    <div
                      className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.gradient} shadow-lg`}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3
                      className="mb-1 text-lg font-bold text-slate-800 dark:text-white"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {r.role}
                    </h3>
                    <p className="mb-5 text-xs text-slate-400 dark:text-slate-500">
                      Dedicated {r.role.toLowerCase()} workspace
                    </p>
                    <ul className="space-y-2.5">
                      {r.perks.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
                        >
                          <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/20">
                            <Check
                              size={10}
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>

                    {/* ── FIX: button passes role via query param to pre-select it ── */}
                    <button
                      onClick={() => goSignup(r.roleParam)}
                      className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${r.btnClass}`}
                    >
                      Get started as {r.role} <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5">
          <motion.div
            {...fadeUp()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-center shadow-2xl shadow-indigo-500/20"
          >
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2
                className="text-3xl font-extrabold text-white md:text-4xl"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Ready to transform your academics?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-indigo-100">
                Join AcadLytics and start making data-driven decisions for
                better academic outcomes.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => goSignup()}
                  className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
                >
                  Create free account <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  Sign in instead
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-slate-200/60 py-10 dark:border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                <GraduationCap size={14} className="text-white" />
              </div>
              <span
                className="text-sm font-bold text-slate-700 dark:text-white"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                AcadLytics
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Academic Intelligence Platform · Built for modern institutions
            </p>
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate("/login")}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => goSignup()}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
