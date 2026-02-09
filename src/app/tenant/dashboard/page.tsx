// // 'use client';


// // import React from 'react';
// // import { useAppSelector } from "@/store/hooks";

// // export default function TenantDashboard() {
 
// //   const { userData } = useAppSelector(state => state.auth);
// //  console.log('Redux userData:', userData);
 
// //   return (
// //     <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
     
// //       <main className="flex-1 p-8">
// //         <div className="max-w-7xl mx-auto">
// //           <header className="mb-8">
// //             <h1 className="text-3xl font-bold text-slate-900">
// //               Welcome back, {userData?.fullName || 'User'}
// //             </h1>
// //             <p className="text-slate-500">You have completed login successfully.</p>
// //           </header>

         
// //         </div>
// //       </main>
// //     </div>
// //   );
// //  }

// // TenantDashboard.tsx
// 'use client';

// import { clearUser } from "@/features/auth/authSlice";
// import { logoutAsync } from "@/features/auth/authThunks";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from 'react';

// export default function TenantDashboard() {
//   const { userData, loading } = useAppSelector(state => state.auth); 


//    const router = useRouter();
// const dispatch = useAppDispatch();
  
//   if (loading || !userData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <h1>Welcome back, {userData?.fullName || 'User'}</h1>
//       <button  onClick={async () => {
//                         await dispatch(logoutAsync());
//                         dispatch(clearUser());
//                         router.push('/tenant/login');
//                       }}>logout</button>
//     </div>
//   );
// }



// app/tenant/dashboard/page.tsx
'use client';

import { useAppSelector } from "@/store/hooks";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Home, IndianRupee, Wrench, CalendarDays, AlertCircle, CheckCircle2,MessageCircle } from 'lucide-react';

export default function TenantDashboard() {
  const { userData,loading } = useAppSelector(state => state.auth);

  const displayName = userData?.fullName?.split(' ')[0] || 'User'; // friendly first-name greeting
// if (loading || !userData) {
//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//       <div className="w-12 h-12">
//         <div className="w-full h-full border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
//       </div>
//     </div>
//   );
// }


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="pl-64 pt-16 min-h-screen overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {/* Greeting + Quick Stats Row */}
          <header className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Hey {displayName}, welcome back 👋
                </h1>
                <p className="mt-1.5 text-slate-600">
                  Here's a quick snapshot of your home and payments
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm">
                  <IndianRupee size={18} />
                  Pay Rent
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                  <Wrench size={18} />
                  Report Issue
                </button>
              </div>
            </div>
          </header>

          {/* Stats Cards - Modern, colorful, with icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {/* Rent Due */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-50 rounded-xl">
                    <IndianRupee className="text-red-600" size={24} />
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    Due soon
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Next Rent</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">₹12,500</p>
                <p className="text-sm text-red-600 mt-2 font-medium">Due in 4 days • 05 Feb 2026</p>
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <CheckCircle2 className="text-emerald-600" size={24} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Good shape
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Maintenance</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">All Clear</p>
                <p className="text-sm text-emerald-600 mt-2 font-medium">0 open requests</p>
              </div>
            </div>

            {/* Lease Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden lg:col-span-2">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <CalendarDays className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Lease Remaining</p>
                    <p className="text-3xl font-bold text-slate-900">184 days</p>
                  </div>
                </div>

                {/* Simple progress bar */}
                <div className="mt-4">
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: '65%' }} // ~184/365 ≈ 50%, adjust dynamically later
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Started: Oct 2025</span>
                    <span>Ends: Oct 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info / Next Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Announcements / Notices */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-600" />
                Important Notices
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="shrink-0 mt-1">
                    <AlertCircle className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Water tank cleaning scheduled</p>
                    <p className="text-sm text-slate-600 mt-1">Tomorrow 10 AM – 12 PM. Water supply may be paused briefly.</p>
                  </div>
                </div>
                {/* Add more notices as needed */}
              </div>
            </div>

            {/* Quick Links or Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: "View Payment History", icon: IndianRupee },
                  { label: "Raise Maintenance Request", icon: Wrench },
                  { label: "Download Lease Copy", icon: Home },
                  { label: "Contact Manager", icon: MessageCircle },
                ].map((item, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                  >
                    <item.icon size={18} className="text-slate-500" />
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}