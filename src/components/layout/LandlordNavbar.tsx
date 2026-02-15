

// components/layout/Navbar.tsx
import { useState } from 'react';
import { 
  Home, 
  MessageCircle, 
  Bell, 
  LayoutGrid, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  ArrowRight 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from 'next/navigation';
import { logoutAsync } from '@/features/auth/authThunks';
import Link from 'next/link';

export default function Navbar() {
    const router = useRouter()
    const dispatch = useAppDispatch()
  const { userData } = useAppSelector(state => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = userData?.fullName || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleMenuItemClick = (action: string) => {
    setShowProfileMenu(false);
    // Handle actions here
    console.log('Menu action:', action);
    router.push('/landlord/profile') 
    
  };

    const handleLogout = async () => {

      
      await dispatch(logoutAsync()).unwrap();
      
      
      
      
      router.push('/landlord/login');
      router.refresh(); // Hard refresh for clean state
      
      console.log('Logout successful!');

     
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-100 h-16 shadow-sm">
      <div className="px-6 md:px-8 h-full flex items-center justify-between mx-auto max-w-7xl">
        
        {/* Brand Section */}
        {/* <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl rotate-6 blur-sm" />
            <div className="relative w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
          </div>
          <span className="text-slate-900 font-bold text-xl tracking-tight">RentSphere</span>
        </div> */}

        <Link
          href="/landlord/dashboard" 
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl rotate-6 blur-sm" />
            <div className="relative w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
          </div>
          <span className="text-slate-900 font-bold text-xl tracking-tight group-hover:text-emerald-600 transition-colors">
            RentSphere
          </span>
        </Link>

        {/* Unified Navigation & Profile Section */}
        <div className="flex items-center gap-9 h-full">
          
          {/* Item 1: Home */}
          <button 
            title="Home" 
            className="text-slate-400 hover:text-emerald-600 transition-all flex items-center justify-center p-1 -m-1 rounded-lg"
          >
            <Home size={22} strokeWidth={1.5} />
          </button>

          {/* Item 2: Messages */}
          <button 
            title="Messages" 
            className="text-slate-400 hover:text-emerald-600 transition-all flex items-center justify-center p-1 -m-1 rounded-lg"
          >
            <MessageCircle size={22} strokeWidth={1.5} />
          </button>

          {/* Item 3: Notifications */}
          <div className="relative flex items-center justify-center p-1 -m-1 rounded-lg">
            <button 
              title="Notifications" 
              className="text-slate-400 hover:text-emerald-600 transition-all"
            >
              <Bell size={22} strokeWidth={1.5} />
            </button>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>

          {/* Profile Pill with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="group flex items-center gap-2.5 pl-2 pr-4 py-1.5 bg-slate-50/80 rounded-full border border-slate-200/70 hover:bg-slate-100 transition-all duration-200 hover:shadow-sm hover:border-slate-300"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm ring-1 ring-emerald-700/30 group-hover:scale-[1.02] transition-transform">
                {initials}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                {displayName}
              </span>
              <ChevronDown 
                size={14} 
                className="text-slate-500 group-hover:text-emerald-600 transition-all duration-200 ml-1 flex-shrink-0" 
                style={{ 
                  transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                
                {/* Profile Header */}
                <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-base shadow-lg ring-2 ring-emerald-500/30">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-base leading-tight">{displayName}</h4>
                      <p className="text-xs text-slate-500 font-medium tracking-wide">LANDLORD</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-0.5 py-3">
                  <ProfileMenuItem 
                    icon={User}
                    label="View Profile" 
                    onClick={() => handleMenuItemClick('profile')}
                  />
                  {/* <ProfileMenuItem 
                    icon={Settings}
                    label="Settings" 
                    onClick={() => handleMenuItemClick('settings')}
                  /> */}
                  <div className="px-2">
                    <div className="w-full h-px bg-slate-100 my-2" />
                  </div>
                  <ProfileMenuItem 
                    icon={LogOut}
                    label="Sign Out" 
                    onClick={handleLogout}
                    destructive
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

// Reusable Profile Menu Item Component
function ProfileMenuItem({ 
  icon: Icon, 
  label, 
  onClick, 
  destructive = false 
}: { 
  icon: any; 
  label: string; 
  onClick: () => void; 
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200
        hover:bg-${destructive ? 'rose' : 'slate'}-50 hover:text-${destructive ? 'rose' : 'slate'}-900
        ${destructive ? 'text-rose-600 hover:text-rose-700 hover:shadow-sm hover:shadow-rose-100/50' : ''}
      `}
    >
      <Icon size={18} strokeWidth={2.2} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}