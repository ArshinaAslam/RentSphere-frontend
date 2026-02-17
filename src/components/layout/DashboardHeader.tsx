

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
      await dispatch(logoutAsync());
      router.replace('/admin/login');
      
      console.log('Logout successful!');

     
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 h-16 shadow-sm">
      <div className="px-8 h-full flex items-center justify-end mx-auto">
        
      
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