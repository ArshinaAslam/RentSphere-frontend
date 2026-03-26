'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CreditCard, CheckCircle, XCircle, Clock,
  IndianRupee, Calendar, FileText,
  AlertCircle, Loader2, Building,
  Search, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

import Navbar   from '@/components/layout/Navbar';
import Sidebar  from '@/components/layout/Sidebar';
import { fetchTenantLeases }            from '@/features/lease/leaseThunk';
import type { Lease }                        from '@/features/lease/types';
import {
  fetchTenantPayments,
  createDepositOrderThunk,
  createRentOrderThunk,
  verifyPaymentThunk,
} from '@/features/payment/paymentThunk';
import { loadRazorpayScript, openRazorpay } from '@/hooks/useRazorpay';
import { useAppDispatch, useAppSelector }   from '@/store/hooks';
import type { Payment } from '@/features/payment/types';

const STATUS_COLOR: Record<Payment['status'], string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed:    'bg-red-100 text-red-600',
};

const TYPE_LABEL: Record<Payment['type'], string> = {
  deposit:  'Security Deposit',
  rent:     'Monthly Rent',
  late_fee: 'Late Fee',
  refund:   'Refund',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const LIMIT = 10;

export default function TenantPaymentsPage() {
  const dispatch       = useAppDispatch();
  const { userData }   = useAppSelector(s => s.auth);
  const { leases }     = useAppSelector(s => s.lease);
  const { payments, pagination, isLoading: isLoadingPayments } =
    useAppSelector(s => s.payment);

  // ── table filters / pagination state ──
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page,         setPage]         = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, typeFilter, statusFilter]);

  // Fetch payments whenever query params change
  useEffect(() => {
    void dispatch(fetchTenantPayments({
      page,
      limit:  LIMIT,
      search: debouncedSearch || undefined,
      type:   typeFilter      || undefined,
      status: statusFilter    || undefined,
    }));
  }, [dispatch, page, debouncedSearch, typeFilter, statusFilter]);

  // Leases data (for pending deposits section)
  useEffect(() => { void dispatch(fetchTenantLeases()); }, [dispatch]);

  // ── Pending deposit leases ──
  const pendingDepositLeases = leases.filter(lease => {
    if (!['signed', 'active'].includes(lease.status)) return false;
    return !payments.some(
      p => p.leaseId === lease._id && p.type === 'deposit' && p.status === 'completed'
    );
  });

  // ── Pay handler (deposit or rent) ──
  const handlePay = useCallback(async (
    lease: Lease | null,
    payment?: Payment,
  ) => {
    const key = payment?._id ?? lease?._id ?? '';
    if (isProcessing) return;
    setIsProcessing(key);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error('Failed to load payment gateway.'); return; }

      let orderResult: any;

      if (payment?.type === 'rent' && payment.month && payment.year) {
        // rent payment
        const result = await dispatch(createRentOrderThunk({
          leaseId: payment.leaseId,
          month:   payment.month,
          year:    payment.year,
        }));
        if (!createRentOrderThunk.fulfilled.match(result)) {
          toast.error(typeof result.payload === 'string' ? result.payload : 'Failed to create order');
          return;
        }
        orderResult = result.payload;
      } else if (lease) {
        // deposit payment
        const result = await dispatch(createDepositOrderThunk(lease._id));
        if (!createDepositOrderThunk.fulfilled.match(result)) {
          toast.error(typeof result.payload === 'string' ? result.payload : 'Failed to create order');
          return;
        }
        orderResult = result.payload;
      }

      const { orderId, amount, currency, paymentId, keyId } = orderResult;

      openRazorpay({
        orderId, amount, currency, keyId,
        description: payment?.type === 'rent'
          ? `Rent for ${MONTHS[(payment.month ?? 1) - 1]} ${payment.year}`
          : `Security Deposit for ${(lease?._id ?? '').slice(-8).toUpperCase()}`,
        prefill: {
          name:  userData?.fullName ?? '',
          email: userData?.email    ?? '',
        },
        onSuccess: async (response) => {
          const verifyResult = await dispatch(verifyPaymentThunk({
            razorpayOrderId:   response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            paymentId,
          }));
          if (verifyPaymentThunk.fulfilled.match(verifyResult)) {
            toast.success('Payment successful!');
            // Refresh current page
            void dispatch(fetchTenantPayments({
              page, limit: LIMIT,
              search: debouncedSearch || undefined,
              type:   typeFilter      || undefined,
              status: statusFilter    || undefined,
            }));
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
          setIsProcessing(null);
        },
        onFailure: (err) => {
          console.error('Payment failed:', err);
          toast.error('Payment cancelled or failed.');
          setIsProcessing(null);
        },
      });
    } catch {
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(null);
    }
  }, [dispatch, isProcessing, userData, page, debouncedSearch, typeFilter, statusFilter]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your rent and deposit payments</p>
          </div>

          {/* ── Pending Deposits ── */}
          {pendingDepositLeases.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Pending Deposit Payments
              </h2>
              <div className="space-y-3">
                {pendingDepositLeases.map(lease => (
                  <div
                    key={lease._id}
                    className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">Security Deposit Due</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Lease #{lease._id.slice(-8).toUpperCase()} · {lease.status === 'signed' ? 'Signed' : 'Active'}
                      </p>
                      <p className="text-sm font-bold text-orange-600 mt-1">
                        {formatCurrency(lease.securityDeposit)}
                      </p>
                    </div>
                    <button
                      onClick={() => void handlePay(lease)}
                      disabled={isProcessing === lease._id}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition flex-shrink-0"
                    >
                      {isProcessing === lease._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <CreditCard className="w-4 h-4" />}
                      {isProcessing === lease._id ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Payment History Table ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">

            {/* Table toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Payment History</h2>
              <div className="flex items-center gap-2 flex-wrap">

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search lease ID or type…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 w-52"
                  />
                </div>

                {/* Type filter */}
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="rent">Rent</option>
                  <option value="late_fee">Late Fee</option>
                  <option value="refund">Refund</option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Lease ID</th>
                    <th className="text-left px-5 py-3">Period</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-right px-5 py-3">Amount</th>
                    <th className="text-center px-5 py-3">Status</th>
                    <th className="text-center px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoadingPayments ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-sm font-medium">No payments found</p>
                          <p className="text-slate-400 text-xs">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payments.map(payment => {
                      const StatusIcon =
                        payment.status === 'completed' ? CheckCircle
                        : payment.status === 'failed'  ? XCircle
                        : Clock;

                      const isPending = payment.status === 'pending';
                      const processingThis = isProcessing === payment._id;

                      return (
                        <tr key={payment._id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Type */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                payment.type === 'deposit' ? 'bg-blue-50'
                                : payment.type === 'rent'  ? 'bg-purple-50'
                                : 'bg-slate-50'
                              }`}>
                                <IndianRupee className={`w-4 h-4 ${
                                  payment.type === 'deposit' ? 'text-blue-600'
                                  : payment.type === 'rent'  ? 'text-purple-600'
                                  : 'text-slate-500'
                                }`} />
                              </div>
                              <span className="font-medium text-slate-800 whitespace-nowrap">
                                {TYPE_LABEL[payment.type]}
                              </span>
                            </div>
                          </td>

                          {/* Lease ID */}
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                              #{payment.leaseId.slice(-8).toUpperCase()}
                            </span>
                          </td>

                          {/* Period */}
                          <td className="px-5 py-4 text-slate-500">
                            {payment.month && payment.year
                              ? `${MONTHS[payment.month - 1]} ${payment.year}`
                              : '—'}
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                            {payment.paidAt
                              ? <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(payment.paidAt)}
                                </span>
                              : payment.dueDate
                              ? <span className="text-orange-500">Due {formatDate(payment.dueDate)}</span>
                              : '—'}
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4 text-right font-bold text-slate-900">
                            {formatCurrency(payment.amount)}
                          </td>

                          {/* Status badge */}
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[payment.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-4 text-center">
                            {payment.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Paid
                              </span>
                            ) : payment.status === 'failed' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                                <XCircle className="w-3.5 h-3.5" />
                                Failed
                              </span>
                            ) : isPending && (payment.type === 'rent' || payment.type === 'deposit') ? (
                              <button
                                onClick={() => void handlePay(null, payment)}
                                disabled={!!isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-semibold rounded-xl transition"
                              >
                                {processingThis
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : <CreditCard className="w-3 h-3" />}
                                {processingThis ? 'Processing…' : 'Pay Now'}
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoadingPayments && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing{' '}
                  <span className="font-medium text-slate-700">
                    {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium text-slate-700">{pagination.total}</span> payments
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(n => n === 1 || n === pagination.totalPages || Math.abs(n - page) <= 1)
                    .reduce<(number | '...')[]>((acc, n, i, arr) => {
                      if (i > 0 && (n as number) - (arr[i - 1] as number) > 1) acc.push('...');
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                            page === item
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}