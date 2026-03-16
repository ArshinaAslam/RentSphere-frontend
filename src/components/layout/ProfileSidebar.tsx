
'use client';



import { User, UserPen, Settings } from 'lucide-react';  


export type ProfileTab = 'basic' | 'edit' | 'settings';

interface ProfileSidebarProps {
  activeTab: ProfileTab;  
  onTabChange: (tab: ProfileTab) => void;  
}

export default function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
 
  const menu = [
    { id: 'basic' as const, label: 'Profile Overview', icon: User },
    { id: 'edit' as const, label: 'Edit Profile', icon: UserPen },
    { id: 'settings' as const, label: 'Account Settings', icon: Settings },  
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
   
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Profile Settings</h2>
        <p className="text-xs text-slate-500 mt-1">Manage your personal details</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
