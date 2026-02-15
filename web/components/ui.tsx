import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react";

type MaybeClass = string | false | null | undefined;

function cx(...classes: MaybeClass[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 dark:from-slate-100 dark:to-slate-50 dark:text-slate-900 dark:hover:from-white dark:hover:to-slate-100",
  secondary:
    "border border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
  ghost:
    "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 dark:hover:text-blue-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600",
};

const buttonSizeMap: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
    "transition-all duration-300",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    buttonVariantMap[variant],
    buttonSizeMap[size],
    className
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <a className={buttonClasses({ variant, size, className })} {...props} />
  );
}

export function inputClasses({ className }: { className?: string } = {}) {
  return cx(
    "w-full rounded-lg px-4 py-3.5 text-base",
    "bg-white dark:bg-slate-800",
    "border-2 border-slate-300 dark:border-slate-600",
    "text-slate-900 dark:text-slate-100",
    "placeholder:text-slate-500 dark:placeholder:text-slate-400",
    "outline-none",
    "focus:border-blue-500 dark:focus:border-blue-400",
    "focus:ring-4 focus:ring-blue-500/10",
    "transition-all duration-200",
    "hover:border-slate-400 dark:hover:border-slate-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClasses({ className })} {...props} />;
}

export function cardClasses({
  strong,
  className,
}: {
  strong?: boolean;
  className?: string;
} = {}) {
  return cx(strong ? "card-surface-strong" : "card-surface", className);
}

export function Card({
  strong,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return <div className={cardClasses({ strong, className })} {...props} />;
}

type BadgeTone = "neutral" | "info" | "success";

const badgeToneMap: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200",
  success:
    "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
};

export function badgeClasses({
  tone = "neutral",
  className,
}: {
  tone?: BadgeTone;
  className?: string;
} = {}) {
  return cx(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
    badgeToneMap[tone],
    className
  );
}

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={badgeClasses({ tone, className })} {...props} />;
}
