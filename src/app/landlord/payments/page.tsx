'use client';

import { useEffect, useState } from 'react';
import {
  IndianRupee, CheckCircle, Clock, XCircle,
  Filter, Building, TrendingUp, Loader2,
  FileText, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

import LandlordNavbar  from '@/components/layout/LandlordNavbar';
import LandlordSidebar from '@/components/layout/LandlordSidebar';
import { fetchLandlordPayments } from '@/features/payment/paymentThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Payment } from '@/features/payment/types';

const STATUS_COLOR = {
  pending:   'bg-yellow-100 text-yellow-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed:    'bg-red-100 text-red-600',
};

const TYPE_LABEL = {
  deposit:  'Security Deposit',
  rent:     'Monthly Rent',
  late_fee: 'Late Fee',
  refund:   'Refund',
};

const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

export default function LandlordPaymentsPage() {
  const dispatch = useAppDispatch();
  const { payments, isLoading } = useAppSelector(s => s.payment);

  const [filter,           setFilter]           = useState<'all' | 'deposit' | 'rent' | 'completed' | 'pending'>('all');
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchLandlordPayments());
  }, [dispatch]);

  const completedPayments = payments.filter(p => p.status === 'completed');

  // ── Group by propertyId ──
  const byProperty = completedPayments.reduce<Record<string, Payment[]>>(
    (acc, p) => {
      const key = p.propertyId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    },
    {}
  );

  // ── Filtered payments ──
  const filteredPayments = payments.filter(p => {
    if (filter === 'all')       return true;
    if (filter === 'completed') return p.status === 'completed';
    if (filter === 'pending')   return p.status === 'pending';
    return p.type === filter;
  });

  const totalEarned    = completedPayments.reduce((sum, p) => sum + p.landlordAmount, 0);
  const totalDeposits  = completedPayments.filter(p => p.type === 'deposit').reduce((sum, p) => sum + p.landlordAmount, 0);
  const totalRent      = completedPayments.filter(p => p.type === 'rent').reduce((sum, p) => sum + p.landlordAmount, 0);
  const totalPlatformFee = completedPayments.reduce((sum, p) => sum + p.platformFee, 0);

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const formatDate     = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-500 text-sm mt-1">
              Track all rent and deposit payments from your tenants
            </p>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Earned',   value: formatCurrency(totalEarned),      color: 'text-emerald-600', icon: TrendingUp    },
              { label: 'Rent Received',  value: formatCurrency(totalRent),         color: 'text-purple-600',  icon: IndianRupee   },
              { label: 'Deposits Held',  value: formatCurrency(totalDeposits),     color: 'text-blue-600',    icon: Building      },
              { label: 'Platform Fee',   value: formatCurrency(totalPlatformFee),  color: 'text-slate-500',   icon: FileText      },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                  </div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* ── Property Breakdown ── */}
          {Object.keys(byProperty).length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Payment Breakdown by Property
              </h2>
              <div className="space-y-3">
                {Object.entries(byProperty).map(([propertyId, propPayments]) => {
                  const totalForProperty = propPayments.reduce((sum, p) => sum + p.landlordAmount, 0);
                  const isExpanded       = expandedProperty === propertyId;

                  return (
                    <div key={propertyId} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedProperty(isExpanded ? null : propertyId)}
                        className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition text-left"
                      >
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">
                            Property #{propertyId.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-400">
                            {propPayments.length} payment{propPayments.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <p className="text-base font-bold text-emerald-600">
                            {formatCurrency(totalForProperty)}
                          </p>
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4 text-slate-400" />
                            : <ChevronDown className="w-4 h-4 text-slate-400" />
                          }
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-100 divide-y divide-slate-50">
                          {propPayments.map(p => (
                            <div key={p._id} className="flex items-center gap-4 px-5 py-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700">
                                  {TYPE_LABEL[p.type as keyof typeof TYPE_LABEL]}
                                  {p.month && p.year && (
                                    <span className="text-slate-400 font-normal ml-1">
                                      — {MONTHS[p.month - 1]} {p.year}
                                    </span>
                                  )}
                                </p>
                                {p.paidAt && (
                                  <p className="text-xs text-slate-400">
                                    Paid {formatDate(p.paidAt)}
                                  </p>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold text-slate-800">
                                  {formatCurrency(p.landlordAmount)}
                                </p>
                                {p.platformFee > 0 && (
                                  <p className="text-xs text-slate-400">
                                    Fee: {formatCurrency(p.platformFee)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── All Payments ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">All Payments</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as typeof filter)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="all">All</option>
                  <option value="deposit">Deposits</option>
                  <option value="rent">Rent</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No payments found</p>
                <p className="text-slate-400 text-xs mt-1">
                  Payments will appear here once tenants pay
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map(payment => {
                  const StatusIcon = payment.status === 'completed'
                    ? CheckCircle
                    : payment.status === 'failed'
                    ? XCircle
                    : Clock;

                  return (
                    <div
                      key={payment._id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        payment.type === 'deposit' ? 'bg-blue-50'
                        : payment.type === 'rent'  ? 'bg-purple-50'
                        : 'bg-slate-50'
                      }`}>
                        <IndianRupee className={`w-5 h-5 ${
                          payment.type === 'deposit' ? 'text-blue-600'
                          : payment.type === 'rent'  ? 'text-purple-600'
                          : 'text-slate-500'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-slate-800">
                            {TYPE_LABEL[payment.type as keyof typeof TYPE_LABEL]}
                          </p>
                          {payment.month && payment.year && (
                            <span className="text-xs text-slate-400">
                              — {MONTHS[payment.month - 1]} {payment.year}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Property #{payment.propertyId.slice(-8).toUpperCase()}
                          {payment.paidAt && ` · Paid ${formatDate(payment.paidAt)}`}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-base font-bold text-slate-900">
                            {formatCurrency(payment.landlordAmount)}
                          </p>
                          {payment.platformFee > 0 && (
                            <p className="text-xs text-slate-400">
                              Total: {formatCurrency(payment.amount)}
                            </p>
                          )}
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[payment.status as keyof typeof STATUS_COLOR]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}