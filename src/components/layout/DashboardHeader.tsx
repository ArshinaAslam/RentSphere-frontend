// 'use client';

// import { Bell, Search, ChevronDown } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// export const DashboardHeader = () => {
//   return (
//     <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
//       {/* Search Bar - Matching your Admin Style */}
//       <div className="relative w-96 hidden md:block">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//         <input 
//           type="text" 
//           placeholder="Search for everything..." 
//           className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A5ACD]/20 focus:border-[#6A5ACD] transition-all"
//         />
//       </div>

//       {/* Right Side Actions */}
//       <div className="flex items-center gap-5 ml-auto">
//         {/* Notifications */}
//         <button className="relative p-2 text-slate-400 hover:text-[#6A5ACD] transition-colors">
//           <Bell size={20} strokeWidth={1.5} />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
//         </button>

//         <div className="h-8 w-px bg-slate-100 mx-2" />

//         {/* User Profile Pill */}
//         <div className="flex items-center gap-3 pl-2 pr-1 py-1 bg-slate-50 rounded-full border border-slate-200">
//           <div className="flex flex-col items-end hidden sm:block">
//             <span className="text-xs font-bold text-slate-900 leading-none">Admin User</span>
//             <span className="text-[10px] text-[#6A5ACD] font-bold uppercase tracking-tighter mt-1">Super Admin</span>
//           </div>
          
//           <Avatar className="h-8 w-8 ring-2 ring-white">
//             <AvatarFallback className="bg-[#6A5ACD] text-white text-xs font-bold">
//               AD
//             </AvatarFallback>
//           </Avatar>
          
//           <ChevronDown size={14} className="text-slate-400 mr-2" />
//         </div>
//       </div>
//     </header>
//   );
// };


'use client';

import { useState } from 'react';
import { 
  MessageCircle, 
  Bell, 
  ChevronDown, 
  LogOut 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from 'next/navigation';
import { logoutAsync } from '@/features/auth/authThunks';

export const DashboardHeader = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(state => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = userData?.fullName || 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await dispatch(logoutAsync()).unwrap();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 h-16 shadow-sm">
      <div className="px-8 h-full flex items-center justify-end mx-auto">
        
        {/* ✅ Action Section: Messages, Notifications, and Profile only */}
        <div className="flex items-center gap-9 h-full">
          
       
          
          {/* Item 1: Messages */}
          <button 
            title="Messages"
            className="text-slate-400 hover:text-[#6A5ACD] transition-all flex items-center justify-center p-1"
          >
            <MessageCircle size={22} strokeWidth={1.5} />
          </button>

          {/* Item 2: Notifications */}
       <div className="relative flex items-center justify-center p-1">
            <button 
              title="Notifications"
              className="text-slate-400 hover:text-[#6A5ACD] transition-all flex items-center justify-center"
            >
              <Bell size={22} strokeWidth={1.5} />
            </button>
            {/* Notification Dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#6A5ACD] rounded-full border-2 border-white"></span>
          </div>

   {/* Item 3: Profile Pill with Dropdown */}
<div className="relative">
  <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="group flex items-center gap-2.5 pl-2 pr-4 py-1.5 bg-slate-50/80 rounded-full border border-slate-200/70 hover:bg-slate-100 transition-all duration-200"
  >
    <div className="w-8 h-8 rounded-full bg-[#6A5ACD] text-white font-semibold flex items-center justify-center text-sm shadow-sm ring-1 ring-[#6A5ACD]/30 group-hover:scale-[1.02] transition-transform">
      {initials}
    </div>
    <span className="text-sm font-semibold text-slate-700 hidden sm:block">
      {displayName}
    </span>
    <ChevronDown 
      size={14} 
      className={`text-slate-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} 
    />
  </button>

  {/* ✅ Compact Dropdown Menu: Reduced width (w-36) and tight spacing (gap-2) */}
  {showProfileMenu && (
    <div className="absolute top-[calc(100%+8px)] right-0 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
      <button 
        onClick={handleLogout} 
        className="w-full flex items-center justify-end gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-all rounded-lg"
      >
        <span>Sign Out</span>
        <LogOut size={14} strokeWidth={3} />
      </button>
    </div>
  )}
</div>
        </div>
      </div>
    </nav>
  );
};