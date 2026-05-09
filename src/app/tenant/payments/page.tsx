"use client";

import { useEffect, useState, useCallback } from "react";

import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { fetchTenantLeases } from "@/features/lease/leaseThunk";
import type { Lease } from "@/features/lease/types";
import {
  fetchTenantPayments,
  createDepositOrderThunk,
  createRentOrderThunk,
  verifyPaymentThunk,
} from "@/features/payment/paymentThunk";
import type { DepositOrderResult, Payment } from "@/features/payment/types";
import { loadRazorpayScript, openRazorpay } from "@/hooks/useRazorpay";
import { paymentService } from "@/services/paymentService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const STATUS_COLOR: Record<Payment["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-600",
};

const LIMIT = 1;

export default function TenantPaymentsPage() {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((s) => s.auth);
  const { leases } = useAppSelector((s) => s.lease);
  const {
    payments,
    pagination,
    isLoading: isLoadingPayments,
  } = useAppSelector((s) => s.payment);

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [paidDepositLeaseIds, setPaidDepositLeaseIds] = useState<Set<string>>(
    new Set(),
  );
  const [depositCheckDone, setDepositCheckDone] = useState(false);

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    void dispatch(
      fetchTenantPayments({
        page,
        limit: LIMIT,

        type: typeFilter || undefined,
        status: statusFilter || undefined,
      }),
    );
  }, [dispatch, page, typeFilter, statusFilter]);

  useEffect(() => {
    void dispatch(fetchTenantLeases());
  }, [dispatch]);

  useEffect(() => {
    paymentService
      .getTenantPayments({
        page: 1,
        limit: 100,
        type: "deposit",
        status: "completed",
      })
      .then((res) => {
        const responseData = res.data as { data: { payments: Payment[] } };
        const completedDeposits = responseData.data.payments ?? [];
        const ids = new Set(completedDeposits.map((p: Payment) => p.leaseId));
        setPaidDepositLeaseIds(ids);
        setDepositCheckDone(true);
      })
      .catch(() => {
        setDepositCheckDone(true);
      });
  }, []);

  const pendingDepositLeases = !depositCheckDone
    ? []
    : leases.filter((lease) => {
        if (!["signed", "active"].includes(lease.status)) return false;
        return !paidDepositLeaseIds.has(lease._id);
      });

  const handlePay = useCallback(
    async (lease: Lease | null, payment?: Payment) => {
      const key = payment?._id ?? lease?._id ?? "";
      if (isProcessing) return;
      setIsProcessing(key);

      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load payment gateway.");
          return;
        }

        let orderResult: DepositOrderResult | undefined;

        if (payment?.type === "rent" && payment.month && payment.year) {
          const result = await dispatch(
            createRentOrderThunk({
              leaseId: payment.leaseId,
              month: payment.month,
              year: payment.year,
            }),
          );
          if (!createRentOrderThunk.fulfilled.match(result)) {
            toast.error(
              typeof result.payload === "string"
                ? result.payload
                : "Failed to create order",
            );
            return;
          }
          orderResult = result.payload;
        } else if (lease) {
          const result = await dispatch(createDepositOrderThunk(lease._id));
          if (!createDepositOrderThunk.fulfilled.match(result)) {
            toast.error(
              typeof result.payload === "string"
                ? result.payload
                : "Failed to create order",
            );
            return;
          }
          orderResult = result.payload;
        }

        if (!orderResult) {
          toast.error("Failed to create order.");
          return;
        }

        const { orderId, amount, currency, paymentId, keyId } = orderResult;

        openRazorpay({
          orderId,
          amount,
          currency,
          keyId,
          description:
            payment?.type === "rent"
              ? `Rent for ${MONTHS[(payment.month ?? 1) - 1]} ${payment.year}`
              : `Security Deposit for ${(lease?._id ?? "").slice(-8).toUpperCase()}`,
          prefill: {
            name: userData?.fullName ?? "",
            email: userData?.email ?? "",
          },
          onSuccess: (response) => {
            void (async () => {
              const verifyResult = await dispatch(
                verifyPaymentThunk({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  paymentId,
                }),
              );
              if (verifyPaymentThunk.fulfilled.match(verifyResult)) {
                toast.success("Payment successful!");
                if (verifyResult.payload.type === "deposit") {
                  setPaidDepositLeaseIds(
                    (prev) => new Set([...prev, verifyResult.payload.leaseId]),
                  );
                }
                void dispatch(
                  fetchTenantPayments({
                    page,
                    limit: LIMIT,
                    type: typeFilter || undefined,
                    status: statusFilter || undefined,
                  }),
                );
              }
              setIsProcessing(null);
            })();
          },
          onFailure: () => {
            toast.error("Payment cancelled or failed.");
            setIsProcessing(null);
          },
        });
      } catch (err) {
        console.error("handlePay error:", err);
        toast.error("Something went wrong. Please try again.");
        setIsProcessing(null);
      }
    },
    [dispatch, isProcessing, userData, page, typeFilter, statusFilter],
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

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

  const TYPE_LABEL: Record<string, string> = {
    deposit: "Security Deposit",
    rent: "Monthly Rent",
    late_fee: "Late Fee",
  };

  const handleDownloadInvoice = async (payment: Payment) => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");

    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();

    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const formatCurrency = (n: number) =>
      `INR ${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

    const invoiceNo = `INV-${payment._id.slice(-8).toUpperCase()}`;
    const issueDate = payment.paidAt ? formatDate(payment.paidAt) : "—";
    const dueDate = payment.dueDate ? formatDate(payment.dueDate) : "—";
    const periodStr =
      payment.month && payment.year
        ? `${MONTHS[payment.month - 1]} ${payment.year}`
        : "—";

    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fill: string,
    ) => {
      pdf.setFillColor(fill);
      pdf.roundedRect(x, y, w, h, r, r, "F");
    };

    pdf.setFillColor("#0f172a");
    pdf.rect(0, 0, W, 42, "F");

    pdf.setFontSize(26);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#ffffff");
    pdf.text("INVOICE", 15, 22);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#6ee7b7");
    pdf.text("RentSphere · Rental Payment Receipt", 15, 29);

    pdf.setFontSize(8);
    pdf.setTextColor("#94a3b8");
    pdf.text("INVOICE NUMBER", W - 15, 14, { align: "right" });
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#ffffff");
    pdf.text(invoiceNo, W - 15, 21, { align: "right" });
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#94a3b8");
    pdf.text(`Date Issued: ${issueDate}`, W - 15, 28, { align: "right" });
    pdf.text(`Period: ${periodStr}`, W - 15, 34, { align: "right" });

    pdf.setFillColor("#f8fafc");
    pdf.rect(0, 42, W, 22, "F");

    roundRect(15, 46, 42, 10, 3, "#d1fae5");
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#059669");
    pdf.text(`✓  PAYMENT ${payment.status.toUpperCase()}`, 36, 52.5, {
      align: "center",
    });

    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#0f172a");
    pdf.text(formatCurrency(payment.amount), W - 15, 55, { align: "right" });

    pdf.setDrawColor("#e2e8f0");
    pdf.line(0, 64, W, 64);

    let y = 72;

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#059669");
    pdf.text("FROM", 15, y);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#0f172a");
    pdf.text("RentSphere Properties", 15, y + 6);

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#64748b");
    pdf.text("12 Business Park, MG Road", 15, y + 12);
    pdf.text("Kozhikode, Kerala 673001", 15, y + 17);
    pdf.text("support@rentsphere.in", 15, y + 22);
    pdf.text("GSTIN: 32ABCDE1234F1Z5", 15, y + 27);

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#059669");
    pdf.text("BILLED TO", W / 2 + 5, y);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#0f172a");

    pdf.text(userData?.fullName ?? "Tenant Name", W / 2 + 5, y + 6);

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#64748b");
    pdf.text(userData?.email ?? "—", W / 2 + 5, y + 12);
    pdf.text(`Phone: ${userData?.phone ?? "—"}`, W / 2 + 5, y + 17);
    pdf.text(
      `Lease ID: #${payment.leaseId.slice(-8).toUpperCase()}`,
      W / 2 + 5,
      y + 22,
    );

    pdf.setDrawColor("#e2e8f0");
    pdf.line(W / 2, y - 2, W / 2, y + 30);

    y += 36;
    pdf.setDrawColor("#e2e8f0");
    pdf.line(15, y, W - 15, y);
    y += 6;

    pdf.setFillColor("#0f172a");
    pdf.rect(15, y, W - 30, 9, "F");
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#ffffff");
    pdf.text("DESCRIPTION", 20, y + 6);
    pdf.text("QTY", 120, y + 6);
    pdf.text("UNIT PRICE", 138, y + 6);
    pdf.text("AMOUNT", W - 17, y + 6, { align: "right" });
    y += 9;

    const descLabel = `${TYPE_LABEL[payment.type]} — ${periodStr}`;
    const subLabel = `Lease #${payment.leaseId.slice(-8).toUpperCase()}`;

    pdf.setFillColor("#ffffff");
    pdf.rect(15, y, W - 30, 14, "F");
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#0f172a");
    pdf.text(descLabel, 20, y + 6);
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#64748b");
    pdf.text(subLabel, 20, y + 11);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#0f172a");
    pdf.text("1", 122, y + 7);
    pdf.text(formatCurrency(payment.amount), 138, y + 7);
    pdf.text(formatCurrency(payment.amount), W - 17, y + 7, { align: "right" });
    y += 14;

    pdf.setFillColor("#f8fafc");
    pdf.rect(15, y, W - 30, 9, "F");
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#475569");
    pdf.text("Platform Service Fee (3%)", 20, y + 6);
    pdf.text("1", 122, y + 6);
    pdf.text(formatCurrency(payment.platformFee), 138, y + 6);
    pdf.text(formatCurrency(payment.platformFee), W - 17, y + 6, {
      align: "right",
    });
    y += 9;

    pdf.setDrawColor("#e2e8f0");
    pdf.line(15, y, W - 15, y);
    y += 4;

    const totalRows: [string, string, boolean][] = [
      ["Subtotal", formatCurrency(payment.amount), false],
      ["Platform Fee", `– ${formatCurrency(payment.platformFee)}`, false],
      ["Landlord Receives", formatCurrency(payment.landlordAmount), true],
    ];

    totalRows.forEach(([label, val, isBold]) => {
      if (isBold) {
        pdf.setFillColor("#0f172a");
        pdf.rect(W - 85, y, 70, 9, "F");
        pdf.setTextColor("#ffffff");
      } else {
        pdf.setFillColor("#f1f5f9");
        pdf.rect(W - 85, y, 70, 9, "F");
        pdf.setTextColor("#0f172a");
      }
      pdf.setFontSize(9);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      pdf.text(label, W - 83, y + 6);
      pdf.text(val, W - 17, y + 6, { align: "right" });
      y += 9;
    });

    y += 8;
    pdf.setDrawColor("#e2e8f0");
    pdf.line(15, y, W - 15, y);
    y += 8;

    pdf.setFillColor("#f8fafc");
    pdf.rect(15, y, W - 30, 40, "F");
    pdf.setDrawColor("#e2e8f0");
    pdf.rect(15, y, W - 30, 40, "S");

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#059669");
    pdf.text("PAYMENT INFORMATION", 20, y + 7);

    const payRows = [
      ["Method:", "Razorpay (UPI / Online)"],
      ["Transaction ID:", payment._id],
      ["Payment Date:", issueDate],
      ["Due Date:", dueDate],
    ];
    payRows.forEach(([lbl, val], i) => {
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#64748b");
      pdf.text(lbl, 20, y + 14 + i * 7);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor("#0f172a");
      pdf.text(val, 55, y + 14 + i * 7);
    });

    pdf.setDrawColor("#e2e8f0");
    pdf.line(W / 2, y, W / 2, y + 40);

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#059669");
    pdf.text("NOTES & TERMS", W / 2 + 5, y + 7);

    const notes = [
      "• System-generated invoice. No signature required.",
      "• Payment processed securely via Razorpay.",
      "• Disputes: contact support@rentsphere.in within 7 days.",
      "• Late payments attract 1.5% per month penalty.",
    ];
    notes.forEach((note, i) => {
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor("#475569");
      pdf.text(note, W / 2 + 5, y + 14 + i * 7);
    });

    y += 48;

    pdf.setFillColor("#0f172a");
    pdf.rect(0, H - 16, W, 16, "F");
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor("#6ee7b7");
    pdf.text("Thank you for your payment!", 15, H - 7);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#94a3b8");
    pdf.text(
      `Generated on ${new Date().toLocaleDateString("en-IN")} · RentSphere · support@rentsphere.in`,
      W - 15,
      H - 7,
      { align: "right" },
    );

    pdf.save(`invoice-${invoiceNo}.pdf`);
    toast.success("Invoice downloaded!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your rent and deposit payments
            </p>
          </div>

          {pendingDepositLeases.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Pending Deposit Payments
              </h2>
              <div className="space-y-3">
                {pendingDepositLeases.map((lease) => (
                  <div
                    key={lease._id}
                    className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        Security Deposit Due
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Lease #{lease._id.slice(-8).toUpperCase()} ·{" "}
                        {lease.status === "signed" ? "Signed" : "Active"}
                      </p>
                      <p className="text-sm font-bold text-orange-600 mt-1">
                        {formatCurrency(lease.securityDeposit)}
                      </p>
                    </div>
                    <button
                      onClick={() => void handlePay(lease)}
                      disabled={isProcessing === lease._id}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-xl transition flex-shrink-0"
                    >
                      {isProcessing === lease._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {isProcessing === lease._id ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            {/* Table toolbar */}
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

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Type</th>
                    <th className="text-left px-5 py-3">Lease ID</th>
                    <th className="text-left px-5 py-3">Period</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-right px-5 py-3">Amount</th>
                    <th className="text-center px-5 py-3">Status</th>
                    <th className="text-center px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoadingPayments ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-sm font-medium">
                            No payments found
                          </p>
                          <p className="text-slate-400 text-xs">
                            Try adjusting your filters
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

                      const isPending = payment.status === "pending";
                      const processingThis = isProcessing === payment._id;

                      return (
                        <tr
                          key={payment._id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Type */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  payment.type === "deposit"
                                    ? "bg-blue-50"
                                    : payment.type === "rent"
                                      ? "bg-purple-50"
                                      : "bg-slate-50"
                                }`}
                              >
                                <IndianRupee
                                  className={`w-4 h-4 ${
                                    payment.type === "deposit"
                                      ? "text-blue-600"
                                      : payment.type === "rent"
                                        ? "text-purple-600"
                                        : "text-slate-500"
                                  }`}
                                />
                              </div>
                              <span className="font-medium text-slate-800 whitespace-nowrap">
                                {TYPE_LABEL[payment.type]}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                              #{payment.leaseId.slice(-8).toUpperCase()}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {payment.month && payment.year
                              ? `${MONTHS[payment.month - 1]} ${payment.year}`
                              : "—"}
                          </td>

                          <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                            {payment.paidAt ? (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(payment.paidAt)}
                              </span>
                            ) : payment.dueDate ? (
                              <span className="text-orange-500">
                                Due {formatDate(payment.dueDate)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>

                          <td className="px-5 py-4 text-right font-bold text-slate-900">
                            {formatCurrency(payment.amount)}
                          </td>

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
                            {payment.status === "completed" ? (
                              <button
                                onClick={() => {
                                  void handleDownloadInvoice(payment);
                                }}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Invoice
                              </button>
                            ) : payment.status === "failed" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                                <XCircle className="w-3.5 h-3.5" />
                                Failed
                              </span>
                            ) : isPending &&
                              (payment.type === "rent" ||
                                payment.type === "deposit") ? (
                              <button
                                onClick={() => void handlePay(null, payment)}
                                disabled={!!isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-semibold rounded-xl transition"
                              >
                                {processingThis ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CreditCard className="w-3 h-3" />
                                )}
                                {processingThis ? "Processing…" : "Pay Now"}
                              </button>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!isLoadingPayments && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                    {(page - 1) * LIMIT + 1}–
                    {Math.min(page * LIMIT, pagination.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                    {pagination.total}
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
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (n) =>
                        n === 1 ||
                        n === pagination.totalPages ||
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
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={page === pagination.totalPages}
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
