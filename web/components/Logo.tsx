// web/components/Logo.tsx
// Brand wordmark with light + dark gradients.

export function Logo() {
  return (
    <h1
      className="
        text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter
        bg-clip-text text-transparent

        bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900
        dark:bg-gradient-to-r dark:from-slate-100 dark:via-cyan-200 dark:to-indigo-200
      "
    >
      /thepaymentsnerd
    </h1>
  );
}
