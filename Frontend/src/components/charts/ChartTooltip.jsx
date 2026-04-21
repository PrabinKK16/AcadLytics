export const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-white/10 dark:bg-[#1a2035]">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          className="text-base font-bold"
          style={{ color: p.color || "#6366f1" }}
        >
          {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};
