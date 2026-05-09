"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  FileText,
  Calendar,
  Eye,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { fetchLandlordPayments } from "@/features/payment/paymentThunk";
import type { Payment } from "@/features/payment/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const STATUS_COLOR: Record<Payment["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-600",
};

const TYPE_LABEL: Record<Payment["type"], string> = {
  deposit: "Security Deposit",
  rent: "Monthly Rent",
  late_fee: "Late Fee",
  refund: "Refund",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function LandlordPaymentsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { payments, landlordPagination, isLoading } = useAppSelector(
    (s) => s.payment,
  );

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const LIMIT = 2;

  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    void dispatch(
      fetchLandlordPayments({
        page,
        limit: LIMIT,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      }),
    );
  }, [dispatch, page, typeFilter, statusFilter]);

  const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-500 text-sm mt-1">
              Track all rent and deposit payments from your tenants
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                Payment History
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="rent">Rent</option>
                  <option value="late_fee">Late Fee</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                    <th className="text-left px-5 py-3">Property</th>
                    <th className="text-left px-5 py-3">Tenant</th>

                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Period</th>
                    <th className="text-left px-5 py-3">Due Date</th>
                    <th className="text-left px-5 py-3">Paid Date</th>
                    <th className="text-right px-5 py-3">Amount</th>
                    <th className="text-center px-5 py-3">Status</th>
                    <th className="text-center px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-sm font-medium">
                            No payments found
                          </p>
                          <p className="text-slate-400 text-xs">
                            {typeFilter || statusFilter
                              ? "Try adjusting your filters"
                              : "Payments will appear here once tenants pay"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => {
                      const StatusIcon =
                        payment.status === "completed"
                          ? CheckCircle
                          : payment.status === "failed"
                            ? XCircle
                            : Clock;

                      return (
                        <tr
                          key={payment._id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800 truncate max-w-[140px]">
                              {payment.propertyTitle ||
                                `#${payment.propertyId.slice(-8).toUpperCase()}`}
                            </p>
                          </td>

                          {/* Tenant */}
                          <td className="px-5 py-4">
                            <p className="text-slate-700 whitespace-nowrap">
                              {payment.tenantName || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-700 whitespace-nowrap">
                                {TYPE_LABEL[payment.type]}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {payment.month && payment.year
                              ? `${MONTHS[payment.month - 1]} ${payment.year}`
                              : "—"}
                          </td>

                          <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                            {payment.dueDate ? (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(payment.dueDate)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            {payment.paidAt ? (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(payment.paidAt)}
                              </span>
                            ) : (
                              <span className="text-orange-400 text-xs">
                                Not paid yet
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900">
                                {formatCurrency(payment.amount)}
                                {/* <span className="text-xs font-normal text-slate-400 ml-1">total</span> */}
                              </p>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[payment.status]}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() =>
                                router.push(`/landlord/payments/${payment._id}`)
                              }
                              className="p-2 rounded-lg hover:bg-slate-100 transition"
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!isLoading &&
              landlordPagination &&
              landlordPagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                      {(page - 1) * LIMIT + 1}–
                      {Math.min(page * LIMIT, landlordPagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                      {landlordPagination.total}
                    </span>{" "}
                    payments
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>

                    {Array.from(
                      { length: landlordPagination.totalPages },
                      (_, i) => i + 1,
                    )
                      .filter(
                        (n) =>
                          n === 1 ||
                          n === landlordPagination.totalPages ||
                          Math.abs(n - page) <= 1,
                      )
                      .reduce<(number | "...")[]>((acc, n, i, arr) => {
                        if (i > 0 && n - arr[i - 1] > 1) acc.push("...");
                        acc.push(n);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 text-slate-400 text-sm"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setPage(item)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                              page === item
                                ? "bg-emerald-600 text-white"
                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {item}
                          </button>
                        ),
                      )}

                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(landlordPagination.totalPages, p + 1),
                        )
                      }
                      disabled={page === landlordPagination.totalPages}
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
