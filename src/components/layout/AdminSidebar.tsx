// 'use client';

// import { LayoutDashboard, Users, Home, Settings, ShieldAlert } from 'lucide-react';
// import { usePathname, useRouter } from 'next/navigation';

// export default function AdminSidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const menuItems = [
//     { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
//     { name: 'Tenants', icon: Users, path: '/admin/tenant-listing-page' },
//     { name: 'Landlords', icon: Home, path: '/admin/landlords' },
//     { name: 'Reports', icon: ShieldAlert, path: '/admin/reports' },
//     { name: 'Settings', icon: Settings, path: '/admin/settings' },
//   ];

//   return (
//     <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white border-r border-slate-200 p-4 z-40">
//       <div className="space-y-2">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.path;
//           return (
//             <button
//               key={item.name}
//               onClick={() => router.push(item.path)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
//                 isActive 
//                   ? 'bg-[#6A5ACD]/10 text-[#6A5ACD]' 
//                   : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
//               }`}
//             >
//               <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
//               <span className="text-sm">{item.name}</span>
//             </button>
//           );
//         })}
//       </div>
//     </aside>
//   );
// }


'use client';

import { 
  LayoutDashboard, 
  Users, 
  Home, 
  Settings, 
  ShieldAlert,
  Building2,
  FileCheck,
  UserCheck, 
  FileText,
  CreditCard,
  FolderOpen
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Landlord Management", icon: Home, path: "/admin/landlord-listing-page" },
    { title: "Property Management", icon:  Building2, path: "/admin/properties" },
    // { title: "Tenant Verification", icon: UserCheck, path: "/admin/verification" },
    { title: "Tenant Management", icon: Users, path: "/admin/tenant-listing-page" },
    { title: "Lease Agreements", icon: FileText, path: "/admin/leases" },
    { title: "Payments", icon: CreditCard, path: "/admin/payments" },
    { title: "Document Center", icon: FolderOpen, path: "/admin/documents" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#2A2A40] border-r border-[#3A3A55] flex flex-col z-50 shadow-2xl">
      {/* Brand Logo Section */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6A5ACD] rounded-xl flex items-center justify-center shadow-lg shadow-[#6A5ACD]/20">
            <Home className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">
              RentSphere
            </h1>
            <p className="text-[#6A5ACD] text-[10px] font-bold uppercase tracking-widest opacity-80">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.title}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#6A5ACD] text-white shadow-lg shadow-[#6A5ACD]/30' 
                  : 'text-slate-300 hover:bg-[#3A3A55] hover:text-white'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-sm tracking-wide">{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Footer Section */}
      {/* <div className="p-4 border-t border-[#3A3A55]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all">
          <LogOut size={20} strokeWidth={1.5} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div> */}
    </aside>
  );
};