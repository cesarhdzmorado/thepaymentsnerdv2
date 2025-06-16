// components/Logo.tsx
import { Newspaper } from 'lucide-react';

// This component is now JUST the icon.
export function Logo() {
  return (
    <div className="bg-slate-900 p-2 rounded-lg">
      <Newspaper className="h-8 w-8 text-white" />
    </div>
  );
}