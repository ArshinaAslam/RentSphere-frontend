"use client";

import { useState } from "react";

import { IndianRupee, Loader2, X } from "lucide-react";

import type { PropertyPayment } from "@/features/property/types";

interface PaymentsTableProps {
  payments: PropertyPayment[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onFilterChange: (type: string, status: string) => void;
  nameLabel?: string;
  nameValue?: (p: PropertyPayment) => string;
}

function PaymentDrawer({
  payment,
  onClose,
  nameLabel = "Tenant",
  nameValue,
}: {
  payment: PropertyPayment;
  onClose: () => void;
  nameLabel?: string;
  nameValue?: (p: PropertyPayment) => string;
}) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-md flex flex-col max-h-[85vh]">
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Payment receipt</p>
              <p className="text-sm font-semibold text-slate-800">
                #{payment._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  payment.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : payment.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {payment.status}
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Total amount</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{payment.amount.toLocaleString("en-IN")}
            </p>
            {payment.paidAt && (
              <p className="text-xs text-slate-400 mt-1">
                Paid on{" "}
                {new Date(payment.paidAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 pt-4 pb-1">
              {nameLabel}{" "}
            </p>
            {[
              {
                label: "Name",
                value: nameValue ? nameValue(payment) : payment.tenantName,
              },
              {
                label: "Period",
                value:
                  payment.month && payment.year
                    ? `${payment.month} / ${payment.year}`
                    : "-",
              },
              { label: "Type", value: payment.type },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center px-5 py-2.5 border-b border-slate-50"
              >
                <span className="text-xs text-slate-400">{row.label}</span>
                <span className="text-sm font-medium text-slate-800">
                  {row.value}
                </span>
              </div>
            ))}

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 pt-4 pb-1">
              Breakdown
            </p>
            {[
              {
                label: "Rent amount",
                value: `₹${payment.amount.toLocaleString("en-IN")}`,
                color: "text-slate-800",
              },
              {
                label: "Platform fee",
                value: `₹${payment.platformFee.toLocaleString("en-IN")}`,
                color: "text-amber-600",
              },
              {
                label: "You receive",
                value: `₹${payment.landlordAmount.toLocaleString("en-IN")}`,
                color: "text-emerald-600",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center px-5 py-2.5 border-b border-slate-50"
              >
                <span className="text-xs text-slate-400">{row.label}</span>
                <span className={`text-sm font-semibold ${row.color}`}>
                  {row.value}
                </span>
              </div>
            ))}

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 pt-4 pb-1">
              Dates
            </p>
            {[
              {
                label: "Due date",
                value: payment.dueDate
                  ? new Date(payment.dueDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-",
              },
              {
                label: "Paid on",
                value: payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center px-5 py-2.5 border-b border-slate-50"
              >
                <span className="text-xs text-slate-400">{row.label}</span>
                <span className="text-sm font-medium text-slate-800">
                  {row.value}
                </span>
              </div>
            ))}

            {payment.notes && (
              <>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 pt-4 pb-1">
                  Notes
                </p>
                <p className="text-sm text-slate-600 px-5 py-2.5">
                  {payment.notes}
                </p>
              </>
            )}
          </div>

          <div className="px-5 py-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentsTable({
  payments = [],
  loading,
  total,
  page,
  limit,
  onPageChange,
  onFilterChange,
  nameLabel = "Tenant",
  nameValue,
}: PaymentsTableProps) {
  const [selected, setSelected] = useState<PropertyPayment | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const totalPages = Math.ceil(total / limit);

  const filtered = payments.filter((p) => {
    const matchType = typeFilter ? p.type === typeFilter : true;
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchType && matchStatus;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-center py-14">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">Payment History</h2>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              onFilterChange(e.target.value, statusFilter);
            }}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            <option value="">All Types</option>
            <option value="rent">Rent</option>
            <option value="deposit">Deposit</option>
            <option value="late_fee">Late Fee</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              onFilterChange(typeFilter, e.target.value);
            }}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="overdue">Overdue</option>
          </select>

          {(typeFilter || statusFilter) && (
            <button
              onClick={() => {
                setTypeFilter("");
                setStatusFilter("");
                onFilterChange("", "");
              }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {selected && (
        <PaymentDrawer
          payment={selected}
          onClose={() => setSelected(null)}
          nameLabel={nameLabel}
          nameValue={nameValue}
        />
      )}

      {payments.length === 0 ? (
        <div className="flex flex-col items-center py-14 text-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">
            No payments yet
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Payment history will appear here once tenants start paying rent.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    nameLabel,
                    "Type",
                    "Period",
                    "Due Date",
                    "Paid Date",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No payments match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-800 whitespace-nowrap">
                        {nameValue ? nameValue(payment) : payment.tenantName}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                        {payment.type}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                        {payment.month && payment.year
                          ? `${payment.month}/${payment.year}`
                          : "-"}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                        {payment.dueDate
                          ? new Date(payment.dueDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "-"}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString("en-IN")
                          : "-"}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-emerald-600 whitespace-nowrap">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                            payment.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : payment.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => setSelected(payment)}
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline whitespace-nowrap"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {payments.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Page {page} of {totalPages || 1} · {total} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 text-xs rounded-lg border bg-emerald-600 text-white border-emerald-600 font-medium">
                  {page}
                </span>
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= (totalPages || 1)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
