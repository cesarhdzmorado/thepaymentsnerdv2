// web/components/CompactLogo.tsx
export function CompactLogo() {
  return (
    <div className="select-none text-xl font-extrabold tracking-tight">
      <span className="text-slate-500 dark:text-slate-400">/</span>

      <span
        className={[
          "transition-all duration-200",
          "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent",
          "dark:from-slate-100 dark:via-slate-200 dark:to-slate-100",
          "hover:opacity-90",
        ].join(" ")}
      >
        thepaymentsnerd
      </span>
    </div>
  );
}
