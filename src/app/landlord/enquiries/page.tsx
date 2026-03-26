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
  Eye,
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
  const [selectedInquiry, setSelectedInquiry] =
    useState<LandlordInquiry | null>(null);

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
    typeof t === "object" ? t : null;

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

    const result = await dispatch(
      startConversationThunk({
        tenantId:
          typeof inquiry.tenantId === "object"
            ? (inquiry.tenantId as { _id: string })._id
            : inquiry.tenantId,
        landlordId: userData.id,
        inquiryId: inquiry._id,
        message: inquiry.message || inquiry.questions.join(" | "),
      }),
    );

    if (startConversationThunk.fulfilled.match(result)) {
      router.push("/landlord/chat");
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
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 flex items-center justify-center transition group"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                          </button>
                          <button
                            onClick={() => {
                              void handleChatClick(inquiry);
                            }}
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
      {/* ── Inquiry Detail Modal ── */}
{selectedInquiry && (() => {
  const t = getTenant(selectedInquiry.tenantId);
  const p = getProperty(selectedInquiry.propertyId);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Inquiry Details</h2>
          </div>
          <button
            onClick={() => setSelectedInquiry(null)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Tenant */}
          {t && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tenant</p>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {t.avatar ? (
                    <img src={t.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">{t.firstName} {t.lastName ?? ''}</p>
                  {t.email && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-emerald-500" /> {t.email}
                    </div>
                  )}
                  {t.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" /> {t.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Property */}
          {p && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Property</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    alt=""
                    className="w-full h-36 object-cover rounded-lg mb-3"
                  />
                )}
                <p className="font-bold text-slate-900">{p.title}</p>
                {p.city && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    {p.address ? `${p.address}, ` : ''}{p.city}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Questions */}
          {(selectedInquiry.questions.length > 0 || selectedInquiry.message) && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Questions & Message</p>
              <div className="space-y-2">
                {selectedInquiry.questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 rounded-md px-1.5 py-0.5 flex-shrink-0">Q{i + 1}</span>
                    <p className="text-sm text-slate-700">{q}</p>
                  </div>
                ))}
                {selectedInquiry.message && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-400 mb-1">Additional Message</p>
                    <p className="text-sm text-slate-600 italic">"{selectedInquiry.message}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              {formatDate(selectedInquiry.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(selectedInquiry.createdAt)}
            </div>
            {selectedInquiry.status === 'unread' && (
              <span className="ml-auto px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">Unread</span>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedInquiry(null)}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={() => { void handleChatClick(selectedInquiry); setSelectedInquiry(null); }}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Start Chat
          </button>
        </div>

      </div>
    </div>
  );
})()}
    </div>
  );
}
