'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck, MapPin, Clock, X,
  CheckCircle, XCircle, Loader2, Home,
  AlertCircle, Calendar,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyVisits, cancelMyVisit } from '@/features/visit/visitThunk';
import type { RootState } from '@/store';
import type { VisitBooking } from '@/features/visit/types';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function MyVisitsPage() {
  const dispatch = useAppDispatch();
  const { myVisits, isLoadingVisits } = useAppSelector((s: RootState) => s.visit);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmId,    setConfirmId]    = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchMyVisits());
  }, [dispatch]);

  const handleCancel = async (visitId: string) => {
    setCancellingId(visitId);
    await dispatch(cancelMyVisit(visitId));
    setCancellingId(null);
    setConfirmId(null);
  };

  const statusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          classes: 'bg-amber-50 text-amber-700 border border-amber-200',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          classes: 'bg-red-50 text-red-500 border border-red-200',
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      case 'completed':
        return {
          label: 'Completed',
          classes: 'bg-slate-100 text-slate-600 border border-slate-200',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: status,
          classes: 'bg-slate-100 text-slate-600',
          icon: null,
        };
    }
  };

  const activeVisits    = myVisits.filter(v => v.status !== 'cancelled' && v.status !== 'completed');
  const inactiveVisits  = myVisits.filter(v => v.status === 'cancelled' || v.status === 'completed');

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-16 p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 mt-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Visits</h1>
            <p className="text-sm text-slate-500">Manage your scheduled property visits</p>
          </div>
        </div>

        {/* Loading */}
        {isLoadingVisits && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        )}

        {/* Empty */}
        {!isLoadingVisits && myVisits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No visits scheduled</h3>
            <p className="text-slate-400 text-sm mb-6">Browse properties and schedule a visit</p>
            <Link href="/tenant/home">
              <button className="px-5 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold hover:bg-emerald-700 transition">
                Browse Properties
              </button>
            </Link>
          </div>
        )}

        {/* Active Visits */}
        {!isLoadingVisits && activeVisits.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Upcoming Visits ({activeVisits.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {activeVisits.map(visit => (
                <VisitCard
                  key={visit._id}
                  visit={visit}
                  statusConfig={statusConfig}
                  cancellingId={cancellingId}
                  confirmId={confirmId}
                  setConfirmId={setConfirmId}
                  handleCancel={handleCancel}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past / Cancelled Visits */}
        {!isLoadingVisits && inactiveVisits.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Past Visits ({inactiveVisits.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {inactiveVisits.map(visit => (
                <VisitCard
                  key={visit._id}
                  visit={visit}
                  statusConfig={statusConfig}
                  cancellingId={cancellingId}
                  confirmId={confirmId}
                  setConfirmId={setConfirmId}
                  handleCancel={handleCancel}
                />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

/* ── Visit Card ── */
interface VisitCardProps {
  visit:        VisitBooking;
  statusConfig: (s: string) => { label: string; classes: string; icon: React.ReactNode };
  cancellingId: string | null;
  confirmId:    string | null;
  setConfirmId: (id: string | null) => void;
  handleCancel: (id: string) => void;
}

function VisitCard({
  visit, statusConfig, cancellingId, confirmId, setConfirmId, handleCancel,
}: VisitCardProps) {
  const { label, classes, icon } = statusConfig(visit.status);
  const isCancelling = cancellingId === visit._id;
  const isConfirming = confirmId    === visit._id;
  const canCancel    = visit.status === 'pending' || visit.status === 'confirmed';

  // Get property info — populated or string
  const property = typeof visit.propertyId === 'object' ? visit.propertyId : null;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      visit.status === 'cancelled' ? 'opacity-60' : ''
    }`}>

      {/* Property image placeholder */}
      <div className="h-36 bg-slate-100 flex items-center justify-center relative">
        {property?.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Home className="w-10 h-10 text-slate-300" />
        )}

        {/* Status badge */}
        <span className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${classes}`}>
          {icon} {label}
        </span>
      </div>

      <div className="p-5">

        {/* Property title */}
        <h3 className="font-bold text-slate-900 mb-1 truncate">
          {property?.title ?? 'Property'}
        </h3>

        {/* Location */}
        {property?.city && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            {property.address ? `${property.address}, ` : ''}{property.city}
          </div>
        )}

        {/* Date & Time */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">{visit.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>{visit.timeSlot}</span>
          </div>
        </div>

        {/* Cancel button */}
        {canCancel && (
          <>
            {isConfirming ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 font-medium">
                    Are you sure you want to cancel this visit?
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => void handleCancel(visit._id)}
                    disabled={isCancelling}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1"
                  >
                    {isCancelling
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <X className="w-3.5 h-3.5" />
                    }
                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition"
                  >
                    Keep Visit
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(visit._id)}
                className="w-full py-2.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Cancel Visit
              </button>
            )}
          </>
        )}

      </div>
    </div>
  );
}