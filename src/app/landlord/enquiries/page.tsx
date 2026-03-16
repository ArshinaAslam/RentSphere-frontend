"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  MessageSquare,
  Search,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { startConversationThunk } from "@/features/chat/chatThunk";
import { fetchLandlordInquiries } from "@/features/inquiry/inquiryThunk";
import type { TenantInfo, LandlordInquiry } from "@/features/inquiry/types";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const LIMIT = 10;

export default function EnquiriesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((s: RootState) => s.auth);
  const { landlordInquiries, landlordInquiriesTotal, isLoadingLandlord } =
    useAppSelector((s: RootState) => s.inquiry);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    void dispatch(
      fetchLandlordInquiries({
        page,
        limit: LIMIT,
        search: debouncedSearch,
      }),
    );
  }, [page, debouncedSearch, dispatch]);

  const totalPages = Math.ceil(landlordInquiriesTotal / LIMIT);

  const getTenant = (t: LandlordInquiry["tenantId"]): TenantInfo | null =>
    typeof t === "object" ? (t) : null;

  const getProperty = (p: LandlordInquiry["propertyId"]) =>
    typeof p === "object" ? p : null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });


    const handleChatClick = async (inquiry: LandlordInquiry) => {
  const t = getTenant(inquiry.tenantId);
  if (!t || !userData?.id) return;

  const result = await dispatch(startConversationThunk({
    tenantId:   typeof inquiry.tenantId === 'object'
      ? (inquiry.tenantId as { _id: string })._id
      : inquiry.tenantId,
    landlordId: userData.id,
    inquiryId:  inquiry._id,
    message:    inquiry.message || inquiry.questions.join(' | '),
  }));

  if (startConversationThunk.fulfilled.match(result)) {
    router.push('/landlord/chat');
  }
};

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="ml-64 pt-16 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Enquiries</h1>
              <p className="text-sm text-slate-500">
                {landlordInquiriesTotal > 0
                  ? `${landlordInquiriesTotal} total enquiries across your properties`
                  : "Tenant inquiries across all your properties"}
              </p>
            </div>
          </div>
        </div>

        {/* Search — below header */}
        <div className="relative w-64 mb-6">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenant, property..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
          />
        </div>
        {/* Loading */}
        {isLoadingLandlord && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        )}

        {/* Empty */}
        {!isLoadingLandlord && landlordInquiries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No enquiries found
            </h3>
            <p className="text-slate-400 text-sm">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : "No tenants have sent enquiries yet"}
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoadingLandlord && landlordInquiries.length > 0 && (
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
                    Questions
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {landlordInquiries.map((inquiry) => {
                  const t = getTenant(inquiry.tenantId);
                  const p = getProperty(inquiry.propertyId);

                  return (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Tenant */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {t?.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={t.avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {t ? `${t.firstName} ${t.lastName ?? ""}` : "—"}
                            </p>
                            {t?.email && (
                              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                <Mail className="w-3 h-3" /> {t.email}
                              </div>
                            )}
                            {t?.phone && (
                              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                <Phone className="w-3 h-3" /> {t.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {p?.title ?? "—"}
                        </p>
                        {p?.city && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            {p.address ? `${p.address}, ` : ""}
                            {p.city}
                          </div>
                        )}
                      </td>

                      {/* Questions */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="space-y-1">
                          {inquiry.questions.map((q, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-1.5 text-xs text-slate-600"
                            >
                              <span className="text-emerald-500 font-bold flex-shrink-0">
                                Q
                              </span>
                              {q}
                            </div>
                          ))}
                          {inquiry.message && (
                            <p className="text-xs text-slate-400 italic mt-1">
                              "{inquiry.message}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          {formatDate(inquiry.createdAt)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(inquiry.createdAt)}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {inquiry.status === "unread" && (
                            <span
                              className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
                              title="Unread"
                            />
                          )}
                        <button
  onClick={() => { void handleChatClick(inquiry); }}
  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-100 flex items-center justify-center transition group"
  title="Chat"
>
  <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer — always show count, pagination only when needed */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Showing{" "}
                {Math.min((page - 1) * LIMIT + 1, landlordInquiriesTotal)}–
                {Math.min(page * LIMIT, landlordInquiriesTotal)} of{" "}
                {landlordInquiriesTotal} enquiries
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
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
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
