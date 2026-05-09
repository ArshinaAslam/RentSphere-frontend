"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Building,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Loader2,
  FileText,
} from "lucide-react";

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { fetchPaymentById } from "@/features/payment/paymentThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const STATUS_COLOR = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-red-100 text-red-600 border-red-200",
};

const TYPE_LABEL = {
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

function getOverdueDays(dueDate?: string, paidAt?: string): number {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const paid = paidAt ? new Date(paidAt) : new Date();
  return Math.max(
    0,
    Math.floor((paid.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedPayment: payment, isLoading } = useAppSelector(
    (s) => s.payment,
  );

  useEffect(() => {
    if (id) void dispatch(fetchPaymentById(id));
  }, [id, dispatch]);

  const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LandlordNavbar />
        <LandlordSidebar />
        <main className="pt-16 pl-64 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </main>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LandlordNavbar />
        <LandlordSidebar />
        <main className="pt-16 pl-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Payment not found</p>
          </div>
        </main>
      </div>
    );
  }

  const StatusIcon =
    payment.status === "completed"
      ? CheckCircle
      : payment.status === "failed"
        ? XCircle
        : Clock;
  const overdueDays = getOverdueDays(payment.dueDate, payment.paidAt);
  const isOverdue = payment.status === "pending" && overdueDays > 0;
  const wasLate =
    payment.status === "completed" &&
    !!payment.paidAt &&
    !!payment.dueDate &&
    new Date(payment.paidAt) > new Date(payment.dueDate);

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Back */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Payment Details
              </h1>
              <p className="text-slate-400 text-sm font-mono">
                #{payment.leaseId.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${STATUS_COLOR[payment.status]}`}
            >
              <StatusIcon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-base">
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </p>
                <p className="text-xs opacity-70 mt-0.5">
                  {TYPE_LABEL[payment.type]}
                  {payment.month && payment.year
                    ? ` — ${MONTHS[payment.month - 1]} ${payment.year}`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {formatCurrency(payment.amount)}
                </p>
                {isOverdue && (
                  <p className="text-xs font-medium mt-0.5">
                    {overdueDays} day{overdueDays > 1 ? "s" : ""} overdue
                  </p>
                )}
                {wasLate && (
                  <p className="text-xs font-medium mt-0.5">
                    Paid {getOverdueDays(payment.dueDate, payment.paidAt)} day
                    {getOverdueDays(payment.dueDate, payment.paidAt) > 1
                      ? "s"
                      : ""}{" "}
                    late
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tenant
                  </p>
                </div>
                <p className="text-base font-bold text-slate-800">
                  {payment.tenantName || "—"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Property
                  </p>
                </div>
                <p className="text-base font-bold text-slate-800">
                  {payment.propertyTitle ||
                    `#${payment.propertyId.slice(-8).toUpperCase()}`}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Lease ID
                  </p>
                </div>
                <p className="text-base font-bold text-slate-800 font-mono">
                  #{payment.leaseId.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Timeline
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">Due Date</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {payment.dueDate ? formatDate(payment.dueDate) : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      payment.paidAt ? "bg-emerald-100" : "bg-orange-100"
                    }`}
                  >
                    <Calendar
                      className={`w-4 h-4 ${payment.paidAt ? "text-emerald-600" : "text-orange-500"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">Paid Date</p>
                    <p
                      className={`text-sm font-semibold ${payment.paidAt ? "text-emerald-700" : "text-orange-500"}`}
                    >
                      {payment.paidAt
                        ? formatDate(payment.paidAt)
                        : "Not paid yet"}
                    </p>
                  </div>
                  {isOverdue && (
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                      {overdueDays}d overdue
                    </span>
                  )}
                  {wasLate && (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                      Paid late
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Amount Breakdown
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      Total Charged
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>

                {payment.platformFee > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-slate-600">
                        Platform Fee
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-red-500">
                      − {formatCurrency(payment.platformFee)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-slate-600">Late Fee</span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${payment.type === "late_fee" ? "text-orange-500" : "text-slate-400"}`}
                  >
                    {payment.type === "late_fee"
                      ? formatCurrency(payment.amount)
                      : "₹0"}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    You Receive
                  </span>
                  <span className="text-lg font-bold text-emerald-600">
                    {formatCurrency(payment.landlordAmount)}
                  </span>
                </div>
              </div>
            </div>

            {isOverdue && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-orange-700">
                    Payment Overdue
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    This payment is {overdueDays} day
                    {overdueDays > 1 ? "s" : ""} past the due date. A late fee
                    may have been applied automatically.
                  </p>
                </div>
              </div>
            )}

            {payment.type === "late_fee" && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700">
                    Late Fee Charge
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {payment.month && payment.year
                      ? `Applied for ${MONTHS[payment.month - 1]} ${payment.year} due to late rent payment.`
                      : "Applied due to late payment."}
                  </p>
                </div>
              </div>
            )}

            {payment.notes && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Notes
                </p>
                <p className="text-sm text-slate-700">{payment.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
