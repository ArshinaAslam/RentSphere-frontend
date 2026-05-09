'use client';

import { useEffect, useState } from 'react';

import {
  IndianRupee,
  CheckCircle, XCircle, Clock, Loader2,
} from 'lucide-react';

import { fetchAllTransactions } from '@/features/adminRevenue/adminRevenueThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/index';

const LIMIT = 5;

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'];

const TYPE_LABEL: Record<string, string> = {
  deposit:  'Security Deposit',
  rent:     'Monthly Rent',
  late_fee: 'Late Fee',
  refund:   'Refund',
};

const STATUS_COLOR: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending:   'bg-yellow-100 text-yellow-700',
  failed:    'bg-red-100 text-red-600',
};

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function AdminRevenuePage() {
  const dispatch = useAppDispatch();
  const {
    transactions,
    total,
    isLoadingTransactions,
  } = useAppSelector((s: RootState) => s.adminRevenue);

  const [page,         setPage]         = useState(1);
  const [typeFilter,   setTypeFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => { setPage(1); }, [typeFilter, statusFilter]);

  useEffect(() => {
    void dispatch(fetchAllTransactions({
      page,
      limit:  LIMIT,
      type:   typeFilter   || undefined,
      status: statusFilter || undefined,
    }));
  }, [dispatch, page, typeFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Revenue Management</h1>
            <p className="text-slate-500 text-sm">Platform earnings and transaction overview</p>
          </div>
        </div>

       
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">All Transactions</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                <option value="">All Types</option>
                <option value="rent">Rent</option>
                <option value="late_fee">Late Fee</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Lease ID</th>
                  <th className="text-left px-5 py-3">Period</th>
                  <th className="text-right px-5 py-3">Amount</th>
                  <th className="text-right px-5 py-3">Platform Fee</th>
                  <th className="text-right px-5 py-3">Landlord Gets</th>
                  <th className="text-center px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoadingTransactions ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-violet-500 mx-auto" />
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 text-sm">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => {
                    const StatusIcon =
                      tx.status === 'completed' ? CheckCircle
                      : tx.status === 'failed'  ? XCircle
                      : Clock;

                    return (
                      <tr key={tx._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              tx.type === 'deposit' ? 'bg-blue-50'
                              : tx.type === 'rent'  ? 'bg-purple-50'
                              : 'bg-slate-50'
                            }`}>
                              <IndianRupee className={`w-3.5 h-3.5 ${
                                tx.type === 'deposit' ? 'text-blue-600'
                                : tx.type === 'rent'  ? 'text-purple-600'
                                : 'text-slate-500'
                              }`} />
                            </div>
                            <span className="font-medium text-slate-800 whitespace-nowrap text-xs">
                              {TYPE_LABEL[tx.type] ?? tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                            #{tx.leaseId.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs">
                          {tx.month && tx.year ? `${MONTHS_SHORT[tx.month - 1]} ${tx.year}` : '—'}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-slate-900 text-xs">
                          {fmt(tx.amount)}
                        </td>
                        <td className="px-5 py-4 text-right text-xs">
                          <span className="font-semibold text-violet-600">{fmt(tx.platformFee)}</span>
                        </td>
                        <td className="px-5 py-4 text-right text-xs text-slate-600 font-medium">
                          {fmt(tx.landlordAmount)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[tx.status]}`}>
                            <StatusIcon className="w-3 h-3" />
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {tx.paidAt
                            ? new Date(tx.paidAt).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric',
                              })
                            : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!isLoadingTransactions && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
                >Prev</button>
                <span className="px-3 py-1.5 text-xs rounded-lg border bg-violet-600 text-white border-violet-600 font-medium">
                  {page}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
                >Next</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}