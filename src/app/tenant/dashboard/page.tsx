"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import {
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  FileText,
  Heart,
  MessageSquare,
  ArrowRight,
  Building2,
  MapPin,
  BedDouble,
  Bath,
  ChevronRight,
  Zap,
  CalendarCheck,
  Clock,
} from "lucide-react";

import TenantNavbar from "@/components/layout/Navbar";
import TenantSidebar from "@/components/layout/Sidebar";
import { fetchTenantLeases } from "@/features/lease/leaseThunk";
import { fetchTenantPayments } from "@/features/payment/paymentThunk";
import type { VisitBooking } from "@/features/visit/types";
import { fetchMyVisits } from "@/features/visit/visitThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function daysRemaining(endDate: string): number {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ─── Page ─────────
export default function TenantDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { userData } = useAppSelector((s) => s.auth);
  const { leases = [] } = useAppSelector((s) => s.lease);
  const { payments } = useAppSelector((s) => s.payment);
  const { myVisits } = useAppSelector((s) => s.visit);

  const displayName = userData?.fullName?.split(" ")[0] ?? "there";

  useEffect(() => {
    void dispatch(fetchTenantLeases());
    void dispatch(fetchTenantPayments({}));
    void dispatch(fetchMyVisits());
  }, [dispatch]);

  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();
  const activeLease = leases.find((l) => l.status === "active") ?? null;

  const completedPayments = payments.filter((p) => p.status === "completed");
  const pendingPayments = payments.filter((p) => p.status === "pending");

  const totalPaid = completedPayments.reduce((s, p) => s + p.amount, 0);
  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const nextRentDue =
    payments
      .filter(
        (p) =>
          p.type === "rent" &&
          p.status === "pending" &&
          p.month === thisMonth &&
          p.year === thisYear,
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate ?? a.createdAt).getTime() -
          new Date(b.dueDate ?? b.createdAt).getTime(),
      )[0] ?? null;

  const recentPayments = [...completedPayments]
    .sort(
      (a, b) =>
        new Date(b.paidAt ?? b.createdAt).getTime() -
        new Date(a.paidAt ?? a.createdAt).getTime(),
    )
    .slice(0, 5);

  const upcomingVisits = myVisits
    .filter((v: VisitBooking) => new Date(v.date) >= now)
    .sort(
      (a: VisitBooking, b: VisitBooking) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    .slice(0, 3);

  const leaseProgress = activeLease
    ? (() => {
        const total =
          new Date(activeLease.endDate).getTime() -
          new Date(activeLease.startDate).getTime();
        const elapsed =
          now.getTime() - new Date(activeLease.startDate).getTime();
        return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
      })()
    : 0;

  const daysLeft = activeLease ? daysRemaining(activeLease.endDate) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <TenantNavbar />
      <TenantSidebar />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          {/* ── Header ── */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Hey {displayName}, welcome back 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Here's a summary of your rental activity
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-3">
                <IndianRupee className="text-violet-600 w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {fmt(totalPaid)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                <AlertCircle className="text-orange-500 w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Pending Due</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {fmt(totalPending)}
              </p>
              {pendingPayments.length > 0 && (
                <p className="text-xs text-orange-500 mt-1 font-medium">
                  {pendingPayments.length} payment
                  {pendingPayments.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                <FileText className="text-emerald-600 w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Lease Status</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {activeLease ? "Active" : "None"}
              </p>
              {activeLease && (
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  {daysLeft} days left
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                <CalendarCheck className="text-blue-600 w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Total Visits</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {myVisits.length}
              </p>
              {upcomingVisits.length > 0 && (
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  {upcomingVisits.length} upcoming
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeLease ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-violet-600" />
                      Active Lease
                    </h2>
                    <button
                      onClick={() => router.push("/tenant/my-lease")}
                      className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      View lease <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-900 truncate">
                        {activeLease.propertyId?.title ?? "Your Property"}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        {activeLease.propertyId.address && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />{" "}
                            {activeLease.propertyId.address}
                          </span>
                        )}
                        {activeLease.propertyId.bedrooms && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <BedDouble className="w-3 h-3" />{" "}
                            {activeLease.propertyId.bedrooms} Bed
                          </span>
                        )}
                        {activeLease.propertyId.bathrooms && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Bath className="w-3 h-3" />{" "}
                            {activeLease.propertyId.bathrooms} Bath
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-violet-600">
                        {fmt(activeLease.rentAmount ?? 0)}
                      </p>
                      <p className="text-xs text-slate-400">per month</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400">
                        {formatDate(activeLease.startDate)}
                      </span>
                      <span className="text-xs font-semibold text-violet-600">
                        {daysLeft} days left
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(activeLease.endDate)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${leaseProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {leaseProgress}% of lease completed
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                      {
                        label: "Deposit",
                        value: fmt(activeLease.securityDeposit ?? 0),
                      },
                      {
                        label: "Lease ID",
                        value: `#${activeLease._id?.slice(-8).toUpperCase()}`,
                      },
                      { label: "Status", value: "Active" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-slate-50 rounded-xl p-3"
                      >
                        <p className="text-xs text-slate-400">{item.label}</p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-full flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-7 h-7 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      No Active Lease
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Browse properties to get started
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/tenant/home")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-700 transition"
                  >
                    Browse Properties <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {nextRentDue ? (
                <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl shadow-sm p-5 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold">Next Rent Due</p>
                  </div>
                  <p className="text-3xl font-bold">
                    {fmt(nextRentDue.amount)}
                  </p>
                  {nextRentDue.dueDate && (
                    <p className="text-violet-200 text-xs mt-1">
                      Due on {formatDate(nextRentDue.dueDate)}
                    </p>
                  )}
                  <button
                    onClick={() => router.push("/tenant/payments")}
                    className="mt-4 w-full bg-white text-violet-700 rounded-xl py-2 text-xs font-bold hover:bg-violet-50 transition flex items-center justify-center gap-1.5"
                  >
                    Pay Now <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">All Clear!</p>
                  <p className="text-xs text-slate-400 mt-1">
                    No rent due this month
                  </p>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-700 mb-3">
                  Quick Actions
                </h2>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "My Payments",
                      icon: IndianRupee,
                      href: "/tenant/payments",
                    },
                    {
                      label: "My Lease",
                      icon: FileText,
                      href: "/tenant/my-lease",
                    },
                    {
                      label: "Book a Visit",
                      icon: CalendarCheck,
                      href: "/tenant/my-visit",
                    },
                    {
                      label: "Enquiries",
                      icon: MessageSquare,
                      href: "/tenant/enquiries",
                    },
                    {
                      label: "Wishlist",
                      icon: Heart,
                      href: "/tenant/favourites",
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => router.push(item.href)}
                      className="w-full flex items-center gap-3 p-2 text-left rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                    >
                      <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentPayments.length > 0 && (
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-violet-600" />
                    Recent Payments
                  </h2>
                  <button
                    onClick={() => router.push("/tenant/payments")}
                    className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  {recentPayments.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            p.type === "deposit"
                              ? "bg-blue-100"
                              : p.type === "rent"
                                ? "bg-purple-100"
                                : "bg-amber-100"
                          }`}
                        >
                          <IndianRupee
                            className={`w-3.5 h-3.5 ${
                              p.type === "deposit"
                                ? "text-blue-600"
                                : p.type === "rent"
                                  ? "text-purple-600"
                                  : "text-amber-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {p.type === "deposit"
                              ? "Deposit"
                              : p.type === "rent"
                                ? "Rent"
                                : "Late Fee"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {p.paidAt ? formatDate(p.paidAt) : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {fmt(p.amount)}
                        </p>
                        <span className="text-xs text-emerald-600 font-medium">
                          Paid
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Upcoming Visits
                </h2>
                <button
                  onClick={() => router.push("/tenant/my-visit")}
                  className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {upcomingVisits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarCheck className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-xs text-slate-400">No upcoming visits</p>
                  <button
                    onClick={() => router.push("/tenant/my-visit")}
                    className="mt-3 text-xs text-violet-600 font-semibold hover:underline"
                  >
                    Book one now →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingVisits.map((v: VisitBooking) => (
                    <div
                      key={v._id}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {typeof v.propertyId === "object"
                            ? v.propertyId.title
                            : "Property Visit"}
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-0.5">
                          {formatDate(v.date)}
                        </p>
                        {v.timeSlot && (
                          <p className="text-xs text-slate-400">{v.timeSlot}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
