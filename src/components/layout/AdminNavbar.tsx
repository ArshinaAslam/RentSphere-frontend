// 'use client';

// import { Home, Bell, ChevronDown, LogOut, ShieldCheck, Search } from 'lucide-react';
// import { useState } from 'react';

// export default function AdminNavbar() {
//   const [showMenu, setShowMenu] = useState(false);

//   return (
//     <nav className="fixed top-0 z-50 w-full bg-white border-b border-slate-100 h-16 shadow-sm">
//       <div className="px-6 h-full flex items-center justify-between">
        
//         {/* Brand */}
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 bg-[#6A5ACD] rounded-lg flex items-center justify-center shadow-lg shadow-[#6A5ACD]/20">
//             <Home className="w-5 h-5 text-white stroke-[2.5]" />
//           </div>
//           <span className="text-slate-900 font-bold text-xl tracking-tight">RentSphere <span className="text-[#6A5ACD]">Admin</span></span>
//         </div>

//         {/* Search Bar - Global */}
//         <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-[#6A5ACD]/30 transition-all">
//           <Search size={18} className="text-slate-400" />
//           <input type="text" placeholder="Search across platform..." className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none" />
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-6">
//           <button className="text-slate-400 hover:text-[#6A5ACD] relative transition-colors">
//             <Bell size={22} strokeWidth={1.5} />
//             <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
//           </button>

//           <div className="relative">
//             <button 
//               onClick={() => setShowMenu(!showMenu)}
//               className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 rounded-full border border-slate-200 hover:border-[#6A5ACD]/50 transition-all"
//             >
//               <div className="w-8 h-8 rounded-full bg-[#6A5ACD] text-white flex items-center justify-center font-bold text-xs">AD</div>
//               <ChevronDown size={14} className={`text-slate-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
//             </button>

//             {showMenu && (
//               <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
//                 <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#6A5ACD]">
//                   <ShieldCheck size={16} /> Admin Settings
//                 </button>
//                 <div className="h-px bg-slate-100 my-1" />
//                 <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
//                   <LogOut size={16} /> Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

'use client';

import { Bell, ChevronDown, LogOut, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function AdminNavbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* Left - Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
            <span className="text-white font-bold text-lg">RS</span>
            {/* or <Home className="w-5 h-5 text-white" /> */}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900">
              RentSphere
            </span>
            <span className="text-xs font-medium text-indigo-600 -mt-1">Admin</span>
          </div>
        </div>

        {/* Center - Search (visible on md+) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="w-full flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Search size={18} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search tenants, landlords, payments..."
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
            <Bell size={22} strokeWidth={1.6} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full pl-2 pr-3.5 py-1.5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                AD
              </div>
              <ChevronDown
                size={14}
                className={`text-slate-500 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-medium text-slate-900">Admin User</p>
                    <p className="text-xs text-slate-500">admin@rentSphere.com</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    <ShieldCheck size={18} />
                    Admin Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}