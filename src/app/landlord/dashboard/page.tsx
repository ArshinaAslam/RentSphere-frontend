'use client';

import { useAppSelector } from "@/store/hooks";
import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { 
  Home, 
  Users, 
  IndianRupee, 
  FileText, 
  Plus, 
  Building2,
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

export default function LandlordDashboard() {
  const { userData, loading } = useAppSelector(state => state.auth);
  const displayName = userData?.fullName?.split(' ')[0] || 'Landlord';

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
      <LandlordNavbar />
      <LandlordSidebar />

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
                  Manage your properties and earnings overview
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm">
                  <Plus size={18} />
                  Add Property
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                  <Users size={18} />
                  View Tenants
                </button>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {/* Total Properties */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Home className="text-blue-600" size={24} />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Properties</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">12</p>
                <p className="text-sm text-slate-600 mt-2">+2 from last month</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <IndianRupee className="text-emerald-600" size={24} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Monthly
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Revenue</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">₹1,45,000</p>
                <p className="text-sm text-emerald-600 mt-2 font-medium">₹12.5K avg/property</p>
              </div>
            </div>

            {/* Occupied */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <CheckCircle2 className="text-emerald-600" size={24} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    100% occupied
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Tenants</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">12/12</p>
                <p className="text-sm text-emerald-600 mt-2 font-medium">All properties rented</p>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <AlertCircle className="text-amber-600" size={24} />
                  </div>
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    2 pending
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Payments</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">₹25,000</p>
                <p className="text-sm text-amber-600 mt-2 font-medium">Due this week</p>
              </div>
            </div>
          </div>

          {/* Properties Grid + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Properties Preview */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                Your Properties (12)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map((property) => (
                  <div key={property} className="group cursor-pointer hover:shadow-lg transition-all rounded-xl border border-slate-200 p-4 hover:-translate-y-1">
                    <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-3 group-hover:scale-105 transition-transform"></div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1 truncate">2BHK Apartment, Koramangala</h4>
                    <p className="text-xs text-slate-500 mb-2">₹25,000/month</p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">Rented</span>
                      <span className="text-xs text-slate-500">Tenant: Rahul K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: "Add New Property", icon: Plus },
                  { label: "View All Payments", icon: IndianRupee },
                  { label: "Manage Tenants", icon: Users },
                  { label: "Generate Reports", icon: FileText },
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
