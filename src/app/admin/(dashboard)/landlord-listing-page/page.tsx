'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { 
  Search, ChevronLeft, ChevronRight, Mail, Phone, 
  Eye, Loader2, Ban, CheckCircle,
  ShieldCheck, Clock, AlertCircle
} from 'lucide-react';

import { clearError, setCurrentPage, setSearch } from '@/features/admin/adminSlice';
import { fetchLandlordsAsync, toggleLandlordStatusAsync } from '@/features/admin/adminThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const LandlordListingPage = () => {
  const dispatch = useAppDispatch();

  const { 
    landlords, 
    total, 
    currentPage, 
    totalPages, 
    search, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.admin);
  
  const limit = 10;

  
  const [selectedLandlord, setSelectedLandlord] = useState<{
    id: string;
    name: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchLandlordsAsync({ search, page: currentPage, limit }));
  }, [dispatch, search, currentPage]);


  const handleToggleStatus = (id: string, currentStatus: string, name: string) => {
    setSelectedLandlord({ id, name, status: currentStatus });
  };

  const confirmToggle = () => {
    if (!selectedLandlord) return;

    const newStatus =
      selectedLandlord.status === 'active' ? 'blocked' : 'active';

    dispatch(
      toggleLandlordStatusAsync({
        id: selectedLandlord.id,
        status: newStatus,
      })
    );

    setSelectedLandlord(null);
  };

  if (isLoading && landlords.length === 0) {
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Landlord Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage landlords and their KYC verification
          </p>
        </div>

        {/* Search */}
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
            <button
              onClick={() => dispatch(clearError())}
              className="font-bold underline uppercase text-[10px]"
            >
              Clear
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-48">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    KYC Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {landlords.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-slate-50/30 transition-colors">

                    {/* Details */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {landlord.avatar ? (
                            <img
                              src={landlord.avatar}
                              alt={landlord.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#6A5ACD]/10 text-[#6A5ACD] flex items-center justify-center font-bold text-sm">
                              {landlord.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 text-sm">
                          {landlord.fullName}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5 text-sm text-slate-700 font-medium truncate max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="truncate">{landlord.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5 text-sm text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {landlord.phone || '—'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          landlord.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}
                      >
                        {landlord.status}
                      </span>
                    </td>

                    {/* KYC */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-[9px] font-black uppercase tracking-widest border">
                        <span>{landlord.kycStatus}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/landlord-listing-page/${landlord.id}/details`}>
                          <button className="p-2 text-slate-500 hover:text-[#6A5ACD] hover:bg-slate-50 rounded-lg transition-all">
                            <Eye size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() =>
                            handleToggleStatus(
                              landlord.id,
                              landlord.status,
                              landlord.fullName
                            )
                          }
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border ${
                            landlord.status === 'active'
                              ? 'bg-white text-rose-600 border-rose-100 hover:bg-rose-50'
                              : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                          }`}
                        >
                          {landlord.status === 'active' ? (
                            <>
                              <Ban size={14} /> BLOCK
                            </>
                          ) : (
                            <>
                              <CheckCircle size={14} /> UNBLOCK
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ SAME MODAL AS TENANT PAGE */}
      {selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setSelectedLandlord(null)}
          />

          <div className="relative bg-white w-[420px] rounded-3xl shadow-2xl p-8">

            <div className="flex justify-center mb-5">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedLandlord.status === 'active'
                    ? 'bg-rose-100'
                    : 'bg-emerald-100'
                }`}
              >
                {selectedLandlord.status === 'active' ? (
                  <Ban className="w-7 h-7 text-rose-600" />
                ) : (
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                )}
              </div>
            </div>

            <h3 className="text-center text-xl font-bold text-slate-900 mb-2">
              {selectedLandlord.status === 'active'
                ? 'Block this landlord?'
                : 'Unblock this landlord?'}
            </h3>

            <p className="text-center text-sm text-slate-500 mb-8">
              You are about to{' '}
              <span className="font-semibold">
                {selectedLandlord.status === 'active'
                  ? 'block'
                  : 'unblock'}
              </span>{' '}
              <span className="font-semibold">
                {selectedLandlord.name}
              </span>.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedLandlord(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmToggle}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white ${
                  selectedLandlord.status === 'active'
                    ? 'bg-red-600 hover:bg-rose-700 text-black'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandlordListingPage;