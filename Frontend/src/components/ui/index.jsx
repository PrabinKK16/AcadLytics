// ─── Reusable Design System Components ───────────────────────────────────────

export const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-white/[0.06] dark:bg-[#111827] ${className}`}
  >
    {children}
  </div>
);

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bg,
  border,
  subtitle,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`group w-full text-left rounded-2xl border ${border} bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:bg-[#111827]`}
  >
    <div className="flex items-start justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </p>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}
      >
        <Icon size={17} className={color} />
      </span>
    </div>
    <p className={`mt-3 text-3xl font-bold tracking-tight ${color}`}>{value}</p>
    {subtitle && (
      <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
        {subtitle}
      </p>
    )}
  </button>
);

export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex items-start justify-between gap-4">
    <div>
      <h2
        className="text-xl font-bold text-slate-800 dark:text-white"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

export const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
    indigo:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
    violet:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    emerald:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled,
  onClick,
  className = "",
  type = "button",
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15",
    danger:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    ghost:
      "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5",
    outline:
      "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = "", ...props }) => (
  <div>
    {label && (
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 ${className}`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
      <Icon size={28} className="text-slate-300 dark:text-slate-600" />
    </div>
    <p className="font-semibold text-slate-600 dark:text-slate-300">{title}</p>
    {subtitle && (
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
        {subtitle}
      </p>
    )}
  </div>
);

export const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-xl bg-slate-200 dark:bg-white/5 ${className}`}
  />
);

export const Spinner = ({ size = 20 }) => (
  <div
    className="animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"
    style={{ width: size, height: size }}
  />
);

export const LevelBadge = ({ level }) => {
  const map = {
    High: "emerald",
    Medium: "amber",
    Low: "rose",
  };
  return <Badge variant={map[level] || "default"}>{level}</Badge>;
};
