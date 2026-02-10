


import { DashboardSidebar } from "@/components/layout/AdminSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
  
    <div className="flex min-h-screen bg-[#F4F4F9]">
    
      <DashboardSidebar />

    
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        
     
        <DashboardHeader />

      
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}