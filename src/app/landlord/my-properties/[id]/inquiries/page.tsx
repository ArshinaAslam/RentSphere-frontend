'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  User,
  Mail,
  Phone,
  Clock,
  Loader2,
  Inbox,
  MessageCircle,
} from 'lucide-react';

import Navbar from '@/components/layout/LandlordNavbar';
import LandlordSidebar from '@/components/layout/LandlordSidebar';
import { fetchPropertyInquiries } from '@/features/inquiry/inquiryThunk';
import type { TenantInfo } from '@/features/inquiry/types';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function PropertyInquiriesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { propertyInquiries, isLoadingInquiries } =
    useAppSelector((s: RootState) => s.inquiry);

  useEffect(() => {
    if (id) {
      void dispatch(fetchPropertyInquiries(id));
    }
  }, [id, dispatch]);

  const tenant = (t: string | TenantInfo): TenantInfo | null =>
    typeof t === 'object' ? t : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <LandlordSidebar />

      <main className="pl-64 pt-20 px-8 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Property Inquiries
              </h1>
              <p className="text-sm text-slate-500">
                Manage tenant interest
              </p>
            </div>
          </div>

          {!isLoadingInquiries && propertyInquiries.length > 0 && (
            <span className="text-sm text-slate-400">
              {propertyInquiries.length} inquiries
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoadingInquiries && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        )}

        {/* Empty */}
        {!isLoadingInquiries && propertyInquiries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border">
            <Inbox className="w-8 h-8 text-slate-400 mb-3" />
            <h3 className="font-semibold text-slate-700 mb-1">
              No inquiries yet
            </h3>
            <p className="text-sm text-slate-400">
              Tenants haven’t sent any inquiries for this property
            </p>
          </div>
        )}

        {/* Inquiry Cards */}
        {!isLoadingInquiries && propertyInquiries.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {propertyInquiries.map(inquiry => {
              const t = tenant(inquiry.tenantId);

              return (
                <div
                  key={inquiry._id}
                  className={`bg-white rounded-2xl border p-5 space-y-4 shadow-sm transition ${
                    inquiry.status === 'unread'
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : ''
                  }`}
                >
                  {/* Tenant Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {t?.avatar ? (
                        <img
                          src={t.avatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {t ? `${t.firstName} ${t.lastName ?? ''}` : 'Tenant'}
                      </p>

                      {inquiry.status === 'unread' && (
                        <span className="text-xs font-bold text-emerald-600 uppercase">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  {t && (
                    <div className="space-y-1 text-xs text-slate-500">
                      {t.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} /> {t.email}
                        </div>
                      )}
                      {t.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} /> {t.phone}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Questions */}
                  <div className="space-y-2">
                    {inquiry.questions.map((q, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-700"
                      >
                        {q}
                      </div>
                    ))}
                  </div>

                  {/* Message */}
                  {inquiry.message && (
                    <div className="text-xs italic text-slate-600 bg-slate-50 border rounded-lg px-3 py-2">
                      "{inquiry.message}"
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock size={12} />
                    {formatDate(inquiry.createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}