'use client';

import { usePathname, useRouter } from 'next/navigation';

import { LayoutDashboard, Users, Home, Building2, Sparkles, IndianRupee } from 'lucide-react';

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { title: "Dashboard",           icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Landlord Management", icon: Home,            path: "/admin/landlord-listing-page" },
    { title: "Tenant Management",   icon: Users,           path: "/admin/tenant-listing-page" },
    { title: "Property Types",      icon: Building2,       path: "/admin/property-types-page" },
    { title: "Amenities",           icon: Sparkles,        path: "/admin/amenity-types-page" },
    { title: "Revenue",             icon: IndianRupee,     path: "/admin/revenue-page" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#2A2A40] border-r border-[#3A3A55] flex flex-col z-50 shadow-2xl">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6A5ACD] rounded-xl flex items-center justify-center shadow-lg shadow-[#6A5ACD]/20">
            <Home className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">RentSphere</h1>
            <p className="text-[#6A5ACD] text-[10px] font-bold uppercase tracking-widest opacity-80">Admin Portal</p>
          </div>
        </div>
      </div>

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
    </aside>
  );
};