


import { DashboardSidebar } from "@/components/layout/AdminSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    /* ✅ Set the global background color here to avoid "dual-color" issues */
    <div className="flex min-h-screen bg-[#F4F4F9]">
      {/* Sidebar: Fixed width */}
      <DashboardSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        
        {/* Navbar: Sticky at top */}
        <DashboardHeader />

        {/* ✅ The 'main' tag handles the scrolling and inner background consistency */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}