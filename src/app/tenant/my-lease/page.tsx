'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import {
  FileText, CheckCircle, Clock, XCircle, Send,
  Eye, AlertTriangle, Loader2, ChevronRight,
  Calendar, DollarSign,
} from 'lucide-react';

import Navbar  from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { fetchTenantLeases } from '@/features/lease/leaseThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const STATUS_CONFIG = {
  draft:      { label: 'Draft',           color: 'bg-slate-100 text-slate-600',     icon: FileText,    desc: 'Not yet sent'         },
  sent:       { label: 'Pending Review',  color: 'bg-amber-100 text-amber-700',     icon: Send,        desc: 'Awaiting your review' },
  viewed:     { label: 'Reviewed',        color: 'bg-blue-100 text-blue-700',       icon: Eye,         desc: 'Ready to sign'        },
  signed:     { label: 'Signed',          color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, desc: 'Awaiting activation'  },
  active:     { label: 'Active',          color: 'bg-green-100 text-green-700',     icon: CheckCircle, desc: 'Currently active'     },
  expired:    { label: 'Expired',         color: 'bg-orange-100 text-orange-700',   icon: Clock,       desc: 'Lease has ended'      },
  terminated: { label: 'Terminated',      color: 'bg-red-100 text-red-700',         icon: XCircle,     desc: 'Terminated early'     },
};

type LeaseStatus = keyof typeof STATUS_CONFIG;

interface Lease {
  _id:         string;
  status:      LeaseStatus;
  rentAmount:  number;
  startDate:   string;
  endDate:     string;
  leaseType:   string;
  tenantSignature?: { name: string; signedAt: string };
}

export default function TenantLeasePage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const { leases = [], isLoading } = useAppSelector(s => s.lease);
 


  useEffect(() => {
    void dispatch(fetchTenantLeases());
  }, [dispatch]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const activeLease   = leases.find((l: Lease) => l.status === 'active');
  const pendingLeases = leases.filter((l: Lease) => ['sent', 'viewed'].includes(l.status));
  const otherLeases   = leases.filter((l: Lease) => !['active', 'sent', 'viewed'].includes(l.status));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Sidebar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] pt-16 pl-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-3xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">My Lease</h1>
            <p className="text-slate-500 text-sm mt-1">View and manage your lease agreements</p>
          </div>

          {leases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-semibold mb-1">No lease agreements yet</h3>
              <p className="text-slate-400 text-sm">Your landlord will send you a lease agreement when ready</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Active lease */}
              {activeLease && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Active Lease</p>
                  <LeaseCard
                    lease={activeLease}
                    onClick={() => router.push(`/tenant/my-lease/${activeLease._id}`)}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                  />
                </div>
              )}

              {/* Pending action */}
              {pendingLeases.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
                    Action Required
                  </p>
                  <div className="space-y-3">
                    {pendingLeases.map((lease: Lease) => (
                      <LeaseCard
                        key={lease._id}
                        lease={lease}
                        onClick={() => router.push(`/tenant/my-lease/${lease._id}`)}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Past leases */}
              {otherLeases.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Past Leases</p>
                  <div className="space-y-3">
                    {otherLeases.map((lease: Lease) => (
                      <LeaseCard
                        key={lease._id}
                        lease={lease}
                        onClick={() => router.push(`/tenant/my-lease/${lease._id}`)}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function LeaseCard({
  lease,
  onClick,
  formatDate,
  formatCurrency,
}: {
  lease:           Lease;
  onClick:         () => void;
  formatDate:      (d: string) => string;
  formatCurrency:  (n: number) => string;
}) {
  const cfg             = STATUS_CONFIG[lease.status];
  const StatusIcon      = cfg.icon;
  const isActionRequired = ['sent', 'viewed'].includes(lease.status);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 ${
        isActionRequired
          ? 'border-amber-200 hover:border-amber-300'
          : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex items-start gap-4">

        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          lease.status === 'active' ? 'bg-emerald-50' : 'bg-slate-50'
        }`}>
          <FileText className={`w-5 h-5 ${lease.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
            {isActionRequired && (
              <span className="text-xs text-amber-600 font-medium">{cfg.desc}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 text-sm text-slate-600">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              {formatCurrency(lease.rentAmount)}/mo
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(lease.startDate)} → {formatDate(lease.endDate)}
            </span>
            <span className="text-sm text-slate-500 capitalize">{lease.leaseType} term</span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
      </div>

      {/* Action prompts */}
      {lease.status === 'sent' && (
        <div className="mt-3 pt-3 border-t border-amber-100 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-600 font-medium">Please review and sign this lease agreement</p>
        </div>
      )}
      {lease.status === 'viewed' && (
        <div className="mt-3 pt-3 border-t border-blue-100 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-600 font-medium">You have reviewed this — ready to sign</p>
        </div>
      )}
      {lease.status === 'signed' && lease.tenantSignature && (
        <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <p className="text-xs text-emerald-600 font-medium">
            Signed by {lease.tenantSignature.name} on {formatDate(lease.tenantSignature.signedAt)}
          </p>
        </div>
      )}
    </button>
  );
}