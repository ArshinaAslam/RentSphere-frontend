"use client";

import Link from "next/link";

import { Mail, Phone, Eye, Ban, CheckCircle } from "lucide-react";

export interface UserRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "blocked";
  kycStatus?: string;
}

interface UserTableProps {
  rows: UserRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  showKyc?: boolean;
  detailHref?: (id: string) => string;
  onToggle: (id: string, status: string, name: string) => void;
  onPageChange: (page: number) => void;
}

const KYC_STYLES: Record<string, string> = {
  APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  PENDING: "bg-amber-50  text-amber-600  border-amber-100",
  REJECTED: "bg-rose-50   text-rose-600   border-rose-100",
  NOT_SUBMITTED: "bg-slate-50  text-slate-500  border-slate-100",
};

export default function UserTable({
  rows,
  total,
  currentPage,
  totalPages,
  showKyc = false,
  detailHref,
  onToggle,
  onPageChange,
}: UserTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm ">
      <div>
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            {showKyc ? (
              <>
                <col className="w-[22%]" />
                <col className="w-[22%]" />
                <col className="w-[15%]" />
                <col className="w-[10%]" />
                <col className="w-[13%]" />
                {detailHref && <col className="w-[5%]" />}
                <col className="w-[13%]" />
              </>
            ) : (
              <>
                <col className="w-[28%]" />
                <col className="w-[27%]" />
                <col className="w-[18%]" />
                <col className="w-[13%]" />
                <col className="w-[14%]" />
              </>
            )}
          </colgroup>

          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <Th>User Details</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Status</Th>
              {showKyc && <Th>KYC Status</Th>}
              {detailHref && <Th />}
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/30 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                      {row.avatar ? (
                        <img
                          src={row.avatar}
                          alt={row.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#6A5ACD]/10 text-[#6A5ACD] flex items-center justify-center font-bold text-sm">
                          {row.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {row.fullName}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={13} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{row.email}</span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={13} className="text-slate-400 flex-shrink-0" />
                    <span>{row.phone || "—"}</span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      row.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                {showKyc && (
                  <td className="px-6 py-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        KYC_STYLES[row.kycStatus ?? "NOT_SUBMITTED"] ??
                        KYC_STYLES.NOT_SUBMITTED
                      }`}
                    >
                      {row.kycStatus ?? "N/A"}
                    </span>
                  </td>
                )}

                {detailHref && (
                  <td className="px-4 py-5">
                    <Link href={detailHref(row.id)}>
                      <button className="p-2 text-slate-400 hover:text-[#6A5ACD] hover:bg-slate-100 rounded-lg transition">
                        <Eye size={15} />
                      </button>
                    </Link>
                  </td>
                )}

                <td className="px-6 py-5">
                  <button
                    onClick={() => onToggle(row.id, row.status, row.fullName)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 border ${
                      row.status === "active"
                        ? "bg-white text-rose-600 border-rose-100 hover:bg-rose-50"
                        : "bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                    }`}
                  >
                    {row.status === "active" ? (
                      <>
                        <Ban size={13} /> BLOCK
                      </>
                    ) : (
                      <>
                        <CheckCircle size={13} /> UNBLOCK
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
          Total {total} Users
        </p>
        <div className="flex items-center gap-2">
          <PaginationBtn
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            direction="left"
          />
          <div className="w-8 h-8 rounded-lg text-xs font-bold bg-[#6A5ACD] text-white flex items-center justify-center">
            {currentPage}
          </div>
          <PaginationBtn
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            direction="right"
          />
        </div>
      </div>
    </div>
  );
}

// ── small helpers ─────────
function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {children}
    </th>
  );
}

function PaginationBtn({
  onClick,
  disabled,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  direction: "left" | "right";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}
