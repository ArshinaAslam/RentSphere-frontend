
'use client';

import { useEffect, useState } from 'react';

import { 
  Search, Ban, CheckCircle, ChevronLeft, ChevronRight, 
  Mail, Phone, Clock, Loader2, 
} from 'lucide-react';

import { clearError, setSearch, setCurrentPage } from '@/features/admin/adminSlice';
import { 
  fetchTenantsAsync,
  toggleTenantStatusAsync,
} from '@/features/admin/adminThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const TenantListingPage = () => {
  const dispatch = useAppDispatch();
  const { 
    tenants, 
    total, 
    currentPage, 
    totalPages, 
    search, 
    isLoading, 
    error ,
  } = useAppSelector((state) => state.admin);
  
  const limit = 10;

 
  const [selectedTenant, setSelectedTenant] = useState<{
    id: string;
    name: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchTenantsAsync({ search, page: currentPage, limit}));
  }, [dispatch, search, currentPage]);

  const handleToggleStatus = (id: string, currentStatus: string, name: string) => {
    setSelectedTenant({ id, name, status: currentStatus });
  };

  const confirmToggle = () => {
    if (!selectedTenant) return;
    const newStatus = selectedTenant.status === 'active' ? 'blocked' : 'active';
    dispatch(toggleTenantStatusAsync({ id: selectedTenant.id, status: newStatus }));
    setSelectedTenant(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const goToPage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (isLoading && tenants.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A5ACD]" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-700">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage tenants and landlords
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#6A5ACD]/10 focus:border-[#6A5ACD] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex justify-between items-center">
            {error} 
            <button onClick={() => dispatch(clearError())} className="font-bold underline uppercase text-[10px]">Clear</button>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-48">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">KYC Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50/30 transition-colors group">
                    
                    {/* User Details */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {tenant.avatar ? (
                            <img 
                              src={tenant.avatar} 
                              alt={tenant.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#6A5ACD]/10 text-[#6A5ACD] flex items-center justify-center font-bold text-sm">
                              {tenant.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 text-sm">{tenant.fullName}</p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5 text-sm text-slate-700 font-medium truncate max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{tenant.email}</span>
                      </div>
                    </td>
                    
                    {/* Phone */}
                    <td className="px-6 py-5 text-sm text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400 flex-shrink-0" />
                        {tenant.phone || '—'}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        tenant.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>

                    {/* KYC */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-[9px] font-black uppercase tracking-widest border">
                        <Clock size={12} strokeWidth={2.5} />
                        <span>{tenant.kycStatus}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleToggleStatus(tenant.id, tenant.status, tenant.fullName)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 border ${
                          tenant.status === 'active'
                            ? 'bg-white text-rose-600 border-rose-100 hover:bg-rose-50'
                            : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                        }`}
                      >
                        {tenant.status === 'active' ? (
                          <><Ban size={14} /> BLOCK</>
                        ) : (
                          <><CheckCircle size={14} /> UNBLOCK</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              Total {total} Users
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="w-8 h-8 rounded-lg text-xs font-bold bg-[#6A5ACD] text-white flex items-center justify-center">
                {currentPage}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

{/* 🔥 MODERN CONFIRMATION MODAL */}
{selectedTenant && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-md"
      onClick={() => setSelectedTenant(null)}
    />

    {/* Modal Card */}
    <div className="relative bg-white w-[420px] rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">

      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          selectedTenant.status === 'active'
            ? 'bg-rose-100'
            : 'bg-emerald-100'
        }`}>
          {selectedTenant.status === 'active' ? (
            <Ban className="w-7 h-7 text-rose-600" />
          ) : (
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-center text-xl font-bold text-slate-900 mb-2">
        {selectedTenant.status === 'active'
          ? 'Block this user?'
          : 'Unblock this user?'}
      </h3>

      {/* Description */}
      <p className="text-center text-sm text-slate-500 mb-8 leading-relaxed">
        You are about to{' '}
        <span className="font-semibold text-slate-800">
          {selectedTenant.status === 'active' ? 'block' : 'unblock'}
        </span>{' '}
        <span className="font-semibold text-slate-900">
          {selectedTenant.name}
        </span>.
        <br />
        This action can be changed later.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedTenant(null)}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>

        <button
  onClick={confirmToggle}
  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
    selectedTenant.status === 'active'
      ? 'bg-rose-600 hover:bg-rose-700 text-black'
      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
  }`}
>
  {selectedTenant.status === 'active' ? 'Block User' : 'Unblock User'}
</button>
      </div>

    </div>
  </div>
)}
    </>
  );
};

export default TenantListingPage;