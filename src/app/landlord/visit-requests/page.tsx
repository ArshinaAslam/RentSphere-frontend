'use client';

import { useEffect, useState } from 'react';

import {
  CalendarCheck, MapPin, Clock, User,
  Phone, Mail, Loader2, Calendar,
  X, AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import Navbar from '@/components/layout/LandlordNavbar';
import LandlordSidebar from '@/components/layout/LandlordSidebar';
import { fetchLandlordVisits, updateLandlordVisitStatus } from '@/features/landlordVisit/landlordVisitThunk';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const;

export default function VisitRequestsPage() {
  const dispatch = useAppDispatch();
  const { visits, isLoading, updatingId,total, totalPages } =
    useAppSelector((s: RootState) => s.landlordVisit);

   const LIMIT = 10;

const [search,          setSearch]          = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');
const [page,            setPage]            = useState(1);

  const [activeTab,  setActiveTab]  = useState<typeof STATUS_TABS[number]>('all');
  const [confirmId,  setConfirmId]  = useState<string | null>(null);

useEffect(() => {
  void dispatch(fetchLandlordVisits({
    page,
    limit: LIMIT,
    search: debouncedSearch,
  }));
}, [page, debouncedSearch, dispatch]);

// Debounce search
useEffect(() => {
  const t = setTimeout(() => setDebouncedSearch(search), 500);
  return () => clearTimeout(t);
}, [search]);

// Reset page on search or tab change
useEffect(() => { setPage(1); }, [debouncedSearch, activeTab]);
  const filtered = activeTab === 'all'
    ? visits
    : visits.filter(v => v.status === activeTab);

  const counts = {
    all:       visits.length,
    pending:   visits.filter(v => v.status === 'pending').length,
    confirmed: visits.filter(v => v.status === 'confirmed').length,
    cancelled: visits.filter(v => v.status === 'cancelled').length,
    completed: visits.filter(v => v.status === 'completed').length,
  };

  const handleCancel = (visitId: string) => {
    void dispatch(updateLandlordVisitStatus({ visitId, status: 'cancelled' }));
    setConfirmId(null);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending':   return 'bg-amber-50  text-amber-700  border border-amber-200';
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled': return 'bg-red-50    text-red-500    border border-red-200';
      case 'completed': return 'bg-slate-100 text-slate-600  border border-slate-200';
      default:          return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <LandlordSidebar />

      <main className="ml-64 pt-16 p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Visit Requests</h1>
            <p className="text-sm text-slate-500">
              Tenants who scheduled visits to your properties
            </p>
          </div>
        </div>

        {/* Searchbar */}
<div className="relative w-64 mb-4">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
  <input
    type="text"
    value={search}
    onChange={e => setSearch(e.target.value)}
    placeholder="Search  property, date..."
    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
  />
</div>

{/* Tabs */}
<div className="flex gap-2 mb-6 flex-wrap">
  {STATUS_TABS.map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
        activeTab === tab
          ? 'bg-emerald-600 text-white'
          : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-400'
      }`}
    >
      {tab} ({counts[tab]})
    </button>
  ))}
</div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No visit requests</h3>
            <p className="text-slate-400 text-sm">
              {activeTab === 'all' ? 'No tenants have scheduled visits yet' : `No ${activeTab} visits`}
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && filtered.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(visit => {
                  const tenant   = typeof visit.tenantId   === 'object' ? visit.tenantId   : null;
                  const property = typeof visit.propertyId === 'object' ? visit.propertyId : null;
                  const isUpdating   = updatingId  === visit._id;
                  const isConfirming = confirmId   === visit._id;
                  const canCancel    = visit.status === 'pending' || visit.status === 'confirmed';

                  return (
                    <tr key={visit._id} className="hover:bg-slate-50 transition-colors">

                      {/* Tenant */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {tenant?.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={tenant.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {tenant ? `${tenant.firstName} ${tenant.lastName ?? ''}` : '—'}
                            </p>
                            {tenant?.email && (
                              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                <Mail className="w-3 h-3" />
                                {tenant.email}
                              </div>
                            )}
                            {tenant?.phone && (
                              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                <Phone className="w-3 h-3" />
                                {tenant.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {property?.title ?? '—'}
                        </p>
                        {property?.city && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            {property.address ? `${property.address}, ` : ''}{property.city}
                          </div>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          {visit.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Clock className="w-3 h-3" />
                          {visit.timeSlot}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        {canCancel && (
                          <>
                            {isConfirming ? (
                              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-2.5 w-56">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <p className="text-xs text-red-600 font-medium flex-1">
                                  Cancel this visit?
                                </p>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleCancel(visit._id)}
                                    disabled={isUpdating}
                                    className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                                  >
                                    {isUpdating
                                      ? <Loader2 className="w-3 h-3 animate-spin" />
                                      : 'Yes'
                                    }
                                  </button>
                                  <button
                                    onClick={() => setConfirmId(null)}
                                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-semibold rounded-lg transition"
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmId(visit._id)}
                                className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold rounded-xl transition"
                              >
                                <X className="w-3.5 h-3.5" />
                                Cancel Visit
                              </button>
                            )}
                          </>
                        )}

                        {!canCancel && (
                          <span className="text-xs text-slate-400 italic">
                            No actions
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
{totalPages > 1 && (
  <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
    <p className="text-xs text-slate-400">
      Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total} visits
    </p>
    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
            page === i + 1
              ? 'bg-emerald-600 text-white'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => setPage(p => p + 1)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
)}
          </div>
        )}

      </main>
    </div>
  );
}