'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Plus, FileText, Send, Eye, CheckCircle, Clock,
  XCircle, AlertTriangle, Trash2, MoreVertical,
  Search, Filter, Calendar, DollarSign,  Loader2
} from 'lucide-react';

import LandlordNavbar from '@/components/layout/LandlordNavbar';
import LandlordSidebar from '@/components/layout/LandlordSidebar';
import { fetchLandlordLeases, deleteLeaseThunk, sendLeaseThunk } from '@/features/lease/leaseThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const STATUS_CONFIG = {
  draft:      { label: 'Draft',      color: 'bg-slate-100 text-slate-600',   icon: FileText    },
  sent:       { label: 'Sent',       color: 'bg-blue-100 text-blue-600',     icon: Send        },
  viewed:     { label: 'Viewed',     color: 'bg-purple-100 text-purple-600', icon: Eye         },
  signed:     { label: 'Signed',     color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle },
  active:     { label: 'Active',     color: 'bg-green-100 text-green-600',   icon: CheckCircle },
  expired:    { label: 'Expired',    color: 'bg-orange-100 text-orange-600', icon: Clock       },
  terminated: { label: 'Terminated', color: 'bg-red-100 text-red-600',       icon: XCircle     },
};

export default function LandlordLeasesPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  

  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState<string>('all');
  const [openMenuId,    setOpenMenuId]    = useState<string | null>(null);
  const [deletingId,    setDeletingId]    = useState<string | null>(null);
  const [sendingId,     setSendingId]     = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showSendModal,   setShowSendModal]   = useState(false);
const [pendingLeaseId,  setPendingLeaseId]  = useState<string | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const { leases =[], isLoading, pagination } = useAppSelector(s => s.lease);


  useEffect(() => {
    void dispatch(fetchLandlordLeases({ page: currentPage, limit: 10 }));
  }, [dispatch,currentPage]);



  const filtered = leases.filter(lease => {
  const matchStatus = statusFilter === 'all' || lease.status === statusFilter;
  
  if (search === '') return matchStatus;
  
  const q = search.toLowerCase();
  const matchSearch =
    lease._id.toLowerCase().includes(q) ||
    lease.status.toLowerCase().includes(q) ||
    lease.leaseType.toLowerCase().includes(q) ||
    String(lease.rentAmount).includes(q) ||
    new Date(lease.startDate).toLocaleDateString('en-IN').toLowerCase().includes(q) ||
    new Date(lease.endDate).toLocaleDateString('en-IN').toLowerCase().includes(q);

  return matchStatus && matchSearch;
});

const handleDelete = async () => {
  if (!pendingLeaseId) return;
  setDeletingId(pendingLeaseId);
  await dispatch(deleteLeaseThunk(pendingLeaseId));
  setDeletingId(null);
  setOpenMenuId(null);
  setShowDeleteModal(false);
  setPendingLeaseId(null);
};

const handleSend = async () => {
  if (!pendingLeaseId) return;
  setSendingId(pendingLeaseId);
  await dispatch(sendLeaseThunk(pendingLeaseId));
  setSendingId(null);
  setOpenMenuId(null);
  setShowSendModal(false);
  setPendingLeaseId(null);
};
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-5xl mx-auto  px-6  py-8">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Lease Agreements</h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage all your lease agreements in one place
              </p>
            </div>
            <button
              onClick={() => router.push('/landlord/leases/create')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Create Lease
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total',    value: leases.length,                                      color: 'text-slate-900' },
              { label: 'Active',   value: leases.filter(l => l.status === 'active').length,   color: 'text-emerald-600' },
              { label: 'Pending',  value: leases.filter(l => ['sent','viewed'].includes(l.status)).length, color: 'text-blue-600' },
              { label: 'Draft',    value: leases.filter(l => l.status === 'draft').length,    color: 'text-slate-500' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by status, type, rent amount..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="all">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── List ── */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-semibold mb-1">No leases found</h3>
              <p className="text-slate-400 text-sm mb-4">
                {statusFilter !== 'all' ? 'No leases with this status' : 'Create your first lease agreement'}
              </p>
              {statusFilter === 'all' && (
                <button
                  onClick={() => router.push('/landlord/leases/create')}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Create Lease
                </button>
              )}
            </div>
          ) : (
              <>
            <div className="space-y-3">
              {filtered.map(lease => {
                const cfg        = STATUS_CONFIG[lease.status];
                const StatusIcon = cfg.icon;
                const isDeleting = deletingId === lease._id;
                const isSending  = sendingId  === lease._id;

                return (
                  <div
                    key={lease._id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-5 flex items-center gap-4">

                      {/* Icon */}
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            #{lease._id.slice(-8).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="flex items-center gap-1 text-sm text-slate-600">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            {formatCurrency(lease.rentAmount)}/mo
                          </span>
                          <span className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(lease.startDate)} → {formatDate(lease.endDate)}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-slate-500 capitalize">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            {lease.leaseType} term
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* View button */}
                        <button
                          onClick={() => router.push(`/landlord/leases/${lease._id}`)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                        >
                          View
                        </button>

                       
                        {lease.status === 'draft' && (
                          <button
                            onClick={(e) => {  e.stopPropagation();setPendingLeaseId(lease._id); setShowSendModal(true); }}
                            disabled={isSending}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 rounded-lg transition flex items-center gap-1"
                          >
                            {isSending
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Send className="w-3 h-3" />
                            }
                            Send
                          </button>
                        )}

                        {/* 3-dot menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === lease._id ? null : lease._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>

                          {openMenuId === lease._id && (
                            <div className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10 w-40">
                              <button
                                onClick={() => router.push(`/landlord/leases/${lease._id}`)}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              {lease.status === 'draft' && (
                                <>
                                  <button
                                    onClick={() => router.push(`/landlord/leases/${lease._id}/edit`)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                   onClick={(e) => {  e.stopPropagation();setPendingLeaseId(lease._id); setShowDeleteModal(true); }}
                                    disabled={isDeleting}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    {isDeleting
                                      ? <Loader2 className="w-4 h-4 animate-spin" />
                                      : <Trash2 className="w-4 h-4" />
                                    }
                                    Delete
                                  </button>
                                </>
                              )}

                              {['signed', 'active'].includes(lease.status) && (
                                <button
                                  onClick={() => router.push(`/landlord/leases/${lease._id}`)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                  Terminate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom bar for signed leases */}
                    {lease.tenantSignature && (
                      <div className="px-5 py-2.5 border-t border-slate-50 bg-emerald-50/50 rounded-b-2xl flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs text-emerald-700">
                          Signed by <strong>{lease.tenantSignature.name}</strong> on{' '}
                          {formatDate(lease.tenantSignature.signedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-slate-500">
          Showing {((currentPage - 1) * 10) + 1}–{Math.min(currentPage * 10, pagination.total)} of {pagination.total} leases
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 text-sm font-semibold rounded-xl transition ${
                  page === currentPage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.totalPages))}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    )}

</>
          )}
        </div>
      </main>

      {/* Close menu on outside click */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenMenuId(null)}
        />
      )}


      {/* ── Send Modal ── */}
{showSendModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <Send className="w-6 h-6 text-emerald-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Send Lease?</h3>
      <p className="text-sm text-slate-500 mb-6">
        This will send the lease agreement to the tenant for review and signing.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => { setShowSendModal(false); setPendingLeaseId(null); }}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          onClick={() => void handleSend()}
          disabled={!!sendingId}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 rounded-xl transition flex items-center justify-center gap-2"
        >
          {sendingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>
    </div>
  </div>
)}

{/* ── Delete Modal ── */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <Trash2 className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Lease?</h3>
      <p className="text-sm text-slate-500 mb-6">
        This will permanently delete this draft lease. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => { setShowDeleteModal(false); setPendingLeaseId(null); }}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          onClick={() => void handleDelete()}
          disabled={!!deletingId}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-xl transition flex items-center justify-center gap-2"
        >
          {deletingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}