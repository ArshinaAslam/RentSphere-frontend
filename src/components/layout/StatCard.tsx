// components/layout/StatCard.tsx
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconColorClass: string; // Tailored via CSS or Tailwind
}

export const StatCard = ({ title, value, icon, iconColorClass }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        {/* iconColorClass should handle the specific background-tint of the icon */}
        <div className={`p-3 rounded-xl ${iconColorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
};
