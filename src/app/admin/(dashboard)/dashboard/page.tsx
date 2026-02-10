

'use client';

import { 
  Users, UserCheck, Clock, Building2, 
  CheckCircle, UsersRound, CreditCard, Mail 
} from "lucide-react";
import { StatCard } from "@/components/layout/StatCard";

export default function AdminDashboard() {
  const statsRow1 = [
    { title: "Total Landlords", value: "342", icon: <Users className="w-5 h-5" />, iconColorClass: "bg-blue-50 text-blue-600" },
    { title: "Verified Landlords", value: "298", icon: <UserCheck className="w-5 h-5" />, iconColorClass: "bg-[#6A5ACD]/10 text-[#6A5ACD]" },
    { title: "Pending Verifications", value: "44", icon: <Clock className="w-5 h-5" />, iconColorClass: "bg-amber-50 text-amber-600" },
    { title: "Listed Properties", value: "587", icon: <Building2 className="w-5 h-5" />, iconColorClass: "bg-pink-50 text-pink-600" },
  ];

  const statsRow2 = [
    { title: "Verified Properties", value: "523", icon: <CheckCircle className="w-5 h-5" />, iconColorClass: "bg-emerald-50 text-emerald-600" },
    { title: "Active Tenants", value: "1,234", icon: <UsersRound className="w-5 h-5" />, iconColorClass: "bg-cyan-50 text-cyan-600" },
    { title: "Payment Collection", value: "94.2%", icon: <CreditCard className="w-5 h-5" />, iconColorClass: "bg-purple-50 text-purple-600" },
    { title: "Unread Messages", value: "47", icon: <Mail className="w-5 h-5" />, iconColorClass: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="space-y-6">
    
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Monitor and manage your rental property platform</p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsRow1.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsRow2.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-[32px] p-8 h-96 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
           <Clock className="text-slate-300 w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Verification Queues</h3>
        <p className="text-slate-500 text-sm max-w-xs mt-2">Charts and detailed verification lists will appear here as the platform scales.</p>
      </div>
    </div>
  );
}