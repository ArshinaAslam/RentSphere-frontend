// src/components/AccountTypeCard.tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  href : string;

};

export default function AccountTypeCard({
  icon: Icon,
  title,
  description,
  features,
  buttonText,
  href
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-5 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
         <Link href={href} className="block w-full rounded-md bg-emerald-600 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700">
      
          {buttonText}
      </Link>
      </div>
    </div>
  );
}


