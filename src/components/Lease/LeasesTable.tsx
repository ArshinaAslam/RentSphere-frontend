"use client";

import { useState } from "react";
import type { ElementType } from "react";

import { useRouter } from "next/navigation";

import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";

import type { PropertyLease } from "@/features/property/types";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: ElementType }
> = {
  draft: {
    label: "Draft",
    color: "bg-slate-100 text-slate-600",
    icon: FileText,
  },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-600", icon: Send },
  viewed: {
    label: "Viewed",
    color: "bg-purple-100 text-purple-600",
    icon: Eye,
  },
  signed: {
    label: "Signed",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  active: {
    label: "Active",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  expired: {
    label: "Expired",
    color: "bg-orange-100 text-orange-600",
    icon: Clock,
  },
  terminated: {
    label: "Terminated",
    color: "bg-red-100 text-red-600",
    icon: XCircle,
  },
};

interface LeasesTableProps {
  leases: PropertyLease[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onFilterChange: (status: string) => void;
}

export default function LeasesTable({
  leases,
  loading,
  total,
  page,
  limit,
  onPageChange,
  onFilterChange,
}: LeasesTableProps) {
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  const totalPages = Math.ceil(total / limit);

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
        <h2 className="text-base font-bold text-slate-800">Lease History</h2>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            onFilterChange(e.target.value);
          }}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="viewed">Viewed</option>
          <option value="signed">Signed</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {leases.length === 0 ? (
        <div className="flex flex-col items-center py-14 text-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No leases yet</p>
          <p className="text-xs text-slate-400 max-w-xs">
            All lease agreements for this property will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    "Tenant",
                    "Start Date",
                    "End Date",
                    "Monthly Rent",
                    "Type",
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
                {leases.map((lease) => {
                  const cfg =
                    STATUS_CONFIG[lease.status] ?? STATUS_CONFIG["draft"];
                  const StatusIcon = cfg.icon;
                  const start = new Date(lease.startDate);
                  const end = new Date(lease.endDate);
                  const tenant = lease.tenantId;

                  return (
                    <tr
                      key={lease._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-800 whitespace-nowrap">
                        {tenant.firstName} {tenant.lastName}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                        {start.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                        {end.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-emerald-600 whitespace-nowrap">
                        ₹
                        {(
                          lease.rentAmount ??
                          lease.monthlyRent ??
                          0
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap capitalize">
                        {lease.leaseType ?? "-"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${cfg.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() =>
                            router.push(`/landlord/leases/${lease._id}`)
                          }
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline whitespace-nowrap"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {leases.length > 0 && (
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
