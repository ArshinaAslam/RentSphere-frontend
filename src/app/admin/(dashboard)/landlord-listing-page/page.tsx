


'use client';

import { useEffect } from 'react';
import { 
  Search, ChevronLeft, ChevronRight, Mail, Phone, 
  Eye, Loader2, Ban, CheckCircle ,ShieldCheck,Clock,AlertCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLandlordsAsync, toggleUserStatusAsync } from '@/features/users/usersThunks';
import { clearError, setCurrentPage, setSearch } from '@/features/users/usersSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LandlordListingPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { 
    landlords, 
    total, 
    currentPage, 
    totalPages, 
    search, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.users);
  
  const limit = 10;

  useEffect(() => {
    dispatch(fetchLandlordsAsync({ search, page: currentPage, limit }));
  }, [dispatch, search, currentPage]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    dispatch(toggleUserStatusAsync({ id, status: newStatus }));
  };

  if (isLoading && landlords.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A5ACD]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Landlord Management</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Manage landlords and their KYC verification
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search landlords..." 
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
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
              {landlords.map((landlord) => (
                <tr key={landlord.id} className="hover:bg-slate-50/30 transition-colors group">
                  {/* Same table cells as before... */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        {landlord.avatar ? (
                          <img src={landlord.avatar} alt={landlord.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#6A5ACD]/10 text-[#6A5ACD] flex items-center justify-center font-bold text-sm">
                            {landlord.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{landlord.fullName}</p>
                        {/* <p className="text-xs text-slate-500">{landlord.id}</p> */}
                      </div>
                    </div>
                  </td>


                     <td className="px-6 py-5 text-sm text-slate-700 font-medium truncate max-w-[200px]">
                     <div className="flex items-center gap-2">
<Mail size={14} className="text-slate-400 flex-shrink-0" />
                     <span className="truncate">{landlord.email}</span>
                    </div>
                   </td>


                                     <td className="px-6 py-5 text-sm text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400 flex-shrink-0" />
                      {landlord.phone || '—'}
                    </div>
                  </td>
                  {/* Email, Phone, Status, KYC Status cells... */}
                  
                                    <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      landlord.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {landlord.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-[9px] font-black uppercase tracking-widest border cursor-pointer hover:scale-105 transition-all ${
                      landlord.kycStatus === 'APPROVED' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : landlord.kycStatus === 'REJECTED'
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'text-amber-600 bg-amber-50 border border-amber-100'
                    }`}>
                      {landlord.kycStatus === 'APPROVED' && <ShieldCheck size={12} />}
                      {landlord.kycStatus === 'PENDING' && <Clock size={12} strokeWidth={2.5} />}
                      {landlord.kycStatus === 'REJECTED' && <AlertCircle size={12} />}
                      <span>{landlord.kycStatus}</span>
                    </div>
                  </td>



                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* ✅ NAVIGATE TO DETAILS PAGE */}
                      <Link href={`/admin/landlord-listing-page/${landlord.id}/details`}>
                        <button className="p-2 text-slate-500 hover:text-[#6A5ACD] hover:bg-slate-50 rounded-lg transition-all group hover:shadow-sm">
                          <Eye size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </Link>

                      {/* Status Toggle */}
                      <button 
                        onClick={() => handleToggleStatus(landlord.id, landlord.status)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 border ${
                          landlord.status === 'active'
                            ? 'bg-white text-rose-600 border-rose-100 hover:bg-rose-50'
                            : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                        }`}
                      >
                        {landlord.status === 'active' ? <><Ban size={14} /> BLOCK</> : <><CheckCircle size={14} /> UNBLOCK</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - same as before */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            Total {total} Landlords
          </p>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#6A5ACD] transition-all disabled:opacity-30" 
              disabled={currentPage === 1}
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="w-8 h-8 rounded-lg text-xs font-bold bg-[#6A5ACD] text-white flex items-center justify-center shadow-lg shadow-[#6A5ACD]/20">
              {currentPage}
            </div>
            <button 
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#6A5ACD] transition-all disabled:opacity-30"
              disabled={currentPage === totalPages}
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordListingPage;

