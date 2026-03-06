'use client';

import { useEffect } from 'react';

import {
  X, MessageSquare, User, Mail,
  Phone, Clock, Loader2, Inbox, MessageCircle,
} from 'lucide-react';

import { fetchPropertyInquiries } from '@/features/inquiry/inquiryThunk';
import type { TenantInfo } from '@/features/inquiry/types';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearPropertyInquiries } from '@/features/inquiry/inquirySlice';

interface Props {
  propertyId:    string;
  propertyTitle: string;
  onClose:       () => void;
}

export default function PropertyInquiryModal({
  propertyId,
  propertyTitle,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();
  const { propertyInquiries, isLoadingInquiries } =
    useAppSelector((s: RootState) => s.inquiry);

   
  useEffect(() => {
    void dispatch(fetchPropertyInquiries(propertyId));
     return () => { dispatch(clearPropertyInquiries()); };
  }, [propertyId, dispatch]);

  const tenant = (t: string | TenantInfo): TenantInfo | null =>
    typeof t === 'object' ? t : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
      hour:  '2-digit',
      minute:'2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl pointer-events-auto flex flex-col max-h-[85vh] overflow-hidden">

          {/* Header — fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Inquiries</h3>
                <p className="text-xs text-slate-400 truncate max-w-[220px]">
                  {propertyTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

            {/* Loading */}
            {isLoadingInquiries && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
              </div>
            )}

            {/* Empty */}
            {!isLoadingInquiries && propertyInquiries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 mb-1">No inquiries yet</p>
                <p className="text-xs text-slate-400">
                  Tenants haven't sent any inquiries for this property
                </p>
              </div>
            )}

            {/* Inquiry cards */}
            {!isLoadingInquiries && propertyInquiries.map(inquiry => {
              const t = tenant(inquiry.tenantId);
              return (
                <div
                  key={inquiry._id}
                  className={`rounded-xl border p-4 space-y-3 ${
                    inquiry.status === 'unread'
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  {/* Tenant info row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {t?.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {t ? `${t.firstName} ${t.lastName ?? ''}` : 'Tenant'}
                        </p>
                        {inquiry.status === 'unread' && (
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Chat icon — decorative */}
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Contact */}
                  {t && (
                    <div className="flex flex-wrap gap-3">
                      {t.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="w-3 h-3" /> {t.email}
                        </div>
                      )}
                      {t.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="w-3 h-3" /> {t.phone}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Questions */}
                  <div className="space-y-1.5">
                    {inquiry.questions.map((q, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-700 bg-white border border-slate-100 rounded-lg px-3 py-2"
                      >
                        <span className="text-emerald-500 font-bold mt-0.5">Q</span>
                        {q}
                      </div>
                    ))}
                  </div>

                  {/* Additional message */}
                  {inquiry.message && (
                    <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 italic">
                      "{inquiry.message}"
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(inquiry.createdAt)}
                  </div>

                </div>
              );
            })}

          </div>

          {/* Footer count */}
          {!isLoadingInquiries && propertyInquiries.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 flex-shrink-0">
              <p className="text-xs text-slate-400 text-center">
                {propertyInquiries.length} {propertyInquiries.length === 1 ? 'inquiry' : 'inquiries'} for this property
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}