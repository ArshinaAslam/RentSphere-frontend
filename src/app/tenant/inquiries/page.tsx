"use client";

import { useEffect, useState } from "react";

import {
  MessageSquare,
  Inbox,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Home,
  ChevronLeft,
  X,
  Search,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { fetchTenantInquiries } from "@/features/inquiry/inquiryThunk";
import type {
  TenantInquiry,
  PropertyInfo,
  LandlordInfo,
} from "@/features/inquiry/types";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const LIMIT = 2;

export default function TenantInquiriesPage() {
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    tenantInquiries,
    isLoadingTenant,
    tenantInquiriesTotal,
    tenantInquiriesTotalPages,
  } = useAppSelector((s: RootState) => s.inquiry);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    void dispatch(
      fetchTenantInquiries({ page, limit: LIMIT, search: debouncedSearch }),
    );
  }, [dispatch, page, debouncedSearch]);

  const getProperty = (p: TenantInquiry["propertyId"]): PropertyInfo | null =>
    typeof p === "object" ? p : null;

  const getLandlord = (l: TenantInquiry["landlordId"]): LandlordInfo | null =>
    typeof l === "object" ? l : null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Sidebar />

      <main className="ml-64 pt-16 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Inquiries</h1>
            <p className="text-sm text-slate-500">
              {tenantInquiries.length > 0
                ? `${tenantInquiriesTotal} inquiries sent`
                : "Track inquiries you have sent to landlords"}
            </p>
          </div>
        </div>

        <div className="relative w-72 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search property or landlord…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-white
                         text-slate-800 placeholder-slate-400 outline-none
                         focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isLoadingTenant && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        )}

        {!isLoadingTenant && tenantInquiries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No inquiries yet
            </h3>
            <p className="text-slate-400 text-sm">
              Inquiries you send from property pages will appear here
            </p>
          </div>
        )}

        {!isLoadingTenant && tenantInquiries.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Landlord
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenantInquiries.map((inquiry) => {
                  const property = getProperty(inquiry.propertyId);
                  const landlord = getLandlord(inquiry.landlordId);
                  const isSeen = inquiry.status === "read";

                  return (
                    <tr
                      key={inquiry._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Property */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                            {property?.images?.[0] ? (
                              <img
                                src={property.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {property?.title ?? "—"}
                            </p>
                            {property?.city && (
                              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                <MapPin className="w-3 h-3 text-emerald-500" />
                                {property.address
                                  ? `${property.address}, `
                                  : ""}
                                {property.city}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {landlord ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden">
                              {landlord.avatar ? (
                                <img
                                  src={landlord.avatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  {landlord.firstName?.[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 text-sm">
                                {landlord.firstName} {landlord.lastName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {landlord.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

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
                          {/* {inquiry.message && (
                            <p className="text-xs text-slate-400 italic mt-1">
                              "{inquiry.message}"
                            </p>
                          )} */}
                        </div>
                      </td>

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

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isSeen
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {isSeen ? "✓ Read" : "Unread"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Showing {Math.min((page - 1) * LIMIT + 1, tenantInquiriesTotal)}
                –{Math.min(page * LIMIT, tenantInquiriesTotal)} of{" "}
                {tenantInquiriesTotal} inquiries
              </p>

              {tenantInquiriesTotalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: tenantInquiriesTotalPages }, (_, i) => (
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
                    disabled={page === tenantInquiriesTotalPages}
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
