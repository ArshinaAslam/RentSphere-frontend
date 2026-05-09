"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Home,
  IndianRupee,
  Plus,
  Building2,
  AlertCircle,
  CheckCircle2,
  ScrollText,
  CalendarCheck,
  TrendingUp,
  Clock,
  MessageSquare,
  ArrowRight,
  Calendar,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { fetchLandlordInquiries } from "@/features/inquiry/inquiryThunk";
import { fetchLandlordLeases } from "@/features/lease/leaseThunk";
import { fetchLandlordPayments } from "@/features/payment/paymentThunk";
import type { Payment } from "@/features/payment/types";
import { fetchLandlordProperties } from "@/features/property/propertyThunk";
import type { propertyData } from "@/features/property/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";





type FilterRange = "today" | "week" | "month" | "year" | "custom";
interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: number;
    color?: string;
    fill?: string;
    payload: Record<string, unknown>;
  }>;
  label?: string;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
    payload: {
      earned: number;
      pending: number;
      type: string;
    };
  }>;
}
interface BarTooltipPayloadItem {
  dataKey: string;
  name: string;
  value: number;
  fill: string;
  color:string;
}

interface BarTooltipProps {
  active?: boolean;
  payload?: BarTooltipPayloadItem[];
  label?: string;
}


interface PropertyTypePayload {
  earned: number;
  pending: number;
  type: string;
}




function PieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const color = item.color ?? '#000';
  const raw = item.payload as PropertyTypePayload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold capitalize" style={{ color }}>
        {String(item.name ?? '')}
      </p>
      <p className="text-slate-700 font-semibold">{fmt(Number(item.value ?? 0))}</p>
      {raw.pending > 0 && (
        <p className="text-orange-400 font-medium">+{fmt(raw.pending)} pending</p>
      )}
    </div>
  );
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p
          key={String(p.dataKey)}
          style={{ color: String(p.fill ?? p.color ?? '#000') }}
          className="font-semibold"
        >
          {String(p.name)}: {Number(p.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtK = (n: number) =>
  n >= 1_00_000
    ? `₹${(n / 1_00_000).toFixed(1)}L`
    : n >= 1_000
      ? `₹${(n / 1_000).toFixed(1)}K`
      : `₹${n}`;

function getDateRange(filter: FilterRange, customDate: string): [Date, Date] {
  const now = new Date();
  const start = new Date();
  if (filter === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (filter === "week") {
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
  } else if (filter === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (filter === "year") {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  } else if (filter === "custom" && customDate) {
    const d = new Date(customDate);
    d.setHours(0, 0, 0, 0);
    const end = new Date(customDate);
    end.setHours(23, 59, 59, 999);
    return [d, end];
  }
  return [start, now];
}

function buildEarningsBuckets(
  payments: Payment[],
  filter: FilterRange,
  customDate: string,
): { label: string; earned: number; pending: number }[] {
  const [start, end] = getDateRange(filter, customDate);
  const inRange = payments.filter((p) => {
    const d = new Date(p.paidAt ?? p.createdAt);
    return d >= start && d <= end;
  });

  if (filter === "today" || filter === "custom") {
    const hours: Record<number, { earned: number; pending: number }> = {};
    for (let h = 0; h < 24; h++) hours[h] = { earned: 0, pending: 0 };
    inRange.forEach((p) => {
      const h = new Date(p.paidAt ?? p.createdAt).getHours();
      if (p.status === "completed") hours[h].earned += p.landlordAmount;
      if (p.status === "pending") hours[h].pending += p.amount;
    });
    return Object.entries(hours).map(([h, v]) => ({
      label: `${String(h).padStart(2, "0")}:00`,
      ...v,
    }));
  }

  if (filter === "week") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map: Record<number, { earned: number; pending: number }> = {};
    days.forEach((_, i) => (map[i] = { earned: 0, pending: 0 }));
    inRange.forEach((p) => {
      const d = new Date(p.paidAt ?? p.createdAt).getDay();
      if (p.status === "completed") map[d].earned += p.landlordAmount;
      if (p.status === "pending") map[d].pending += p.amount;
    });
    return days.map((label, i) => ({ label, ...map[i] }));
  }

  if (filter === "month") {
    const daysInMonth = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0,
    ).getDate();
    const map: Record<number, { earned: number; pending: number }> = {};
    for (let d = 1; d <= daysInMonth; d++) map[d] = { earned: 0, pending: 0 };
    inRange.forEach((p) => {
      const d = new Date(p.paidAt ?? p.createdAt).getDate();
      if (p.status === "completed") map[d].earned += p.landlordAmount;
      if (p.status === "pending") map[d].pending += p.amount;
    });
    return Object.entries(map).map(([d, v]) => ({ label: `${d}`, ...v }));
  }

  if (filter === "year") {
    const months = [
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
    const map: Record<number, { earned: number; pending: number }> = {};
    months.forEach((_, i) => (map[i] = { earned: 0, pending: 0 }));
    inRange.forEach((p) => {
      const m = new Date(p.paidAt ?? p.createdAt).getMonth();
      if (p.status === "completed") map[m].earned += p.landlordAmount;
      if (p.status === "pending") map[m].pending += p.amount;
    });
    return months.map((label, i) => ({ label, ...map[i] }));
  }

  return [];
}

function buildRevenueByPropertyType(
  payments: Payment[],
  properties: propertyData[],
  filter: FilterRange,
  customDate: string,
): { type: string; earned: number; pending: number }[] {
  const [start, end] = getDateRange(filter, customDate);

  const propTypeMap: Record<string, string> = {};
  properties.forEach((prop) => {
    propTypeMap[prop._id] = prop.type ?? "Other";
  });

  const inRange = payments.filter((p) => {
    const d = new Date(p.paidAt ?? p.createdAt);
    return d >= start && d <= end;
  });

  const map: Record<string, { earned: number; pending: number }> = {};

  inRange.forEach((p) => {
    const type = propTypeMap[p.propertyId] ?? "Other";
    if (!map[type]) map[type] = { earned: 0, pending: 0 };
    if (p.status === "completed") map[type].earned += p.landlordAmount;
    if (p.status === "pending") map[type].pending += p.amount;
  });

  if (Object.keys(map).length === 0) {
    properties.forEach((prop) => {
      const type = prop.type ?? "Other";
      if (!map[type]) map[type] = { earned: 0, pending: 0 };
    });
  }

  return Object.entries(map)
    .map(([type, val]) => ({ type, ...val }))
    .sort((a, b) => b.earned - a.earned);
}

const AreaTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const FILTER_OPTIONS: { key: FilterRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Pick Date" },
];

function FilterBar({
  active,
  customDate,
  onChange,
  onCustomChange,
}: {
  active: FilterRange;
  customDate: string;
  onChange: (f: FilterRange) => void;
  onCustomChange: (d: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            active === opt.key
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <Calendar
            className={`w-3.5 h-3.5 ${active === opt.key ? "text-white" : "text-slate-400"}`}
          />
          {opt.label}
        </button>
      ))}
      {active === "custom" && (
        <input
          type="date"
          value={customDate}
          onChange={(e) => onCustomChange(e.target.value)}
          className="ml-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        />
      )}
    </div>
  );
}

export default function LandlordDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userData } = useAppSelector((s) => s.auth);
  const { leases } = useAppSelector((s) => s.lease);
  const { payments } = useAppSelector((s) => s.payment);
  const { properties } = useAppSelector((s) => s.property);
  const { landlordInquiries } = useAppSelector((s) => s.inquiry);

  const displayName = userData?.fullName?.split(" ")[0] ?? "Landlord";

  const today = new Date().toISOString().split("T")[0];
  const [filter, setFilter] = useState<FilterRange>("month");
  const [customDate, setCustomDate] = useState<string>(today);

  useEffect(() => {
    void dispatch(fetchLandlordLeases({}));
    void dispatch(fetchLandlordPayments({}));
    void dispatch(fetchLandlordProperties({}));
    void dispatch(fetchLandlordInquiries({ page: 1, limit: 100, search: "" }));
  }, [dispatch]);

  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();

  const completedPayments = payments.filter((p) => p.status === "completed");
  const allTimeEarnings = completedPayments.reduce(
    (s, p) => s + p.landlordAmount,
    0,
  );
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const pendingAmount = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const activeLeases = leases.filter((l) => l.status === "active");
  const draftLeases = leases.filter((l) => l.status === "draft");
  const sentLeases = leases.filter((l) =>
    ["sent", "viewed"].includes(l.status),
  );
  const signedLeases = leases.filter((l) => l.status === "signed");
  const totalProperties = properties.length;

  const [rangeStart, rangeEnd] = getDateRange(filter, customDate);

  const filteredCompleted = completedPayments.filter((p) => {
    const d = new Date(p.paidAt ?? p.createdAt);
    return d >= rangeStart && d <= rangeEnd;
  });
  const rangeEarnings = filteredCompleted.reduce(
    (s, p) => s + p.landlordAmount,
    0,
  );

  const filteredPending = pendingPayments.filter((p) => {
    const d = new Date(p.createdAt);
    return d >= rangeStart && d <= rangeEnd;
  });
  const rangePending = filteredPending.reduce((s, p) => s + p.amount, 0);

  const rangeProperties = properties.filter((p) => {
    if (!p.createdAt) return false;
    const d = new Date(p.createdAt);
    return d >= rangeStart && d <= rangeEnd;
  });
  const rangeAvailable = rangeProperties.filter(
    (p) => p.status === "Available",
  ).length;

  const rangeActiveLeases = leases.filter((l) => {
    const d = new Date(l.startDate ?? l.createdAt);
    return l.status === "active" && d >= rangeStart && d <= rangeEnd;
  });
  const rangeSentLeases = leases.filter((l) => {
    const d = new Date(l.createdAt);
    return (
      ["sent", "viewed"].includes(l.status) && d >= rangeStart && d <= rangeEnd
    );
  });

  const earningsBuckets = useMemo(
    () => buildEarningsBuckets(payments, filter, customDate),
    [payments, filter, customDate],
  );

  const revenueByType = useMemo(
    () => buildRevenueByPropertyType(payments, properties, filter, customDate),
    [payments, properties, filter, customDate],
  );

  const TYPE_COLORS = [
    "#6366f1",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#f97316",
    "#ec4899",
    "#8b5cf6",
  ];

  const inquiryChartData = useMemo(() => {
    const [start, end] = getDateRange(filter, customDate);

    const inRange = landlordInquiries.filter((inquiry) => {
      const d = new Date(inquiry.createdAt);
      return d >= start && d <= end;
    });

    if (filter === "today" || filter === "custom") {
      const hours: Record<
        number,
        { date: string; read: number; unread: number }
      > = {};
      for (let h = 0; h < 24; h++)
        hours[h] = {
          date: `${String(h).padStart(2, "0")}:00`,
          read: 0,
          unread: 0,
        };
      inRange.forEach((inquiry) => {
        const h = new Date(inquiry.createdAt).getHours();
        if (inquiry.status === "read") hours[h].read++;
        if (inquiry.status === "unread") hours[h].unread++;
      });
      return Object.values(hours);
    }

    if (filter === "week") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const map: Record<
        number,
        { date: string; read: number; unread: number }
      > = {};
      days.forEach((d, i) => (map[i] = { date: d, read: 0, unread: 0 }));
      inRange.forEach((inquiry) => {
        const d = new Date(inquiry.createdAt).getDay();
        if (inquiry.status === "read") map[d].read++;
        if (inquiry.status === "unread") map[d].unread++;
      });
      return Object.values(map);
    }

    if (filter === "month") {
      const daysInMonth = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        0,
      ).getDate();
      const map: Record<
        number,
        { date: string; read: number; unread: number }
      > = {};
      for (let d = 1; d <= daysInMonth; d++)
        map[d] = { date: `${d}`, read: 0, unread: 0 };
      inRange.forEach((inquiry) => {
        const d = new Date(inquiry.createdAt).getDate();
        if (inquiry.status === "read") map[d].read++;
        if (inquiry.status === "unread") map[d].unread++;
      });
      return Object.values(map);
    }

    if (filter === "year") {
      const months = [
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
      const map: Record<
        number,
        { date: string; read: number; unread: number }
      > = {};
      months.forEach((m, i) => (map[i] = { date: m, read: 0, unread: 0 }));
      inRange.forEach((inquiry) => {
        const m = new Date(inquiry.createdAt).getMonth();
        if (inquiry.status === "read") map[m].read++;
        if (inquiry.status === "unread") map[m].unread++;
      });
      return Object.values(map);
    }

    return [];
  }, [landlordInquiries, filter, customDate]);

  const inquiryStats = useMemo(() => {
    const [start, end] = getDateRange(filter, customDate);
    const inRange = landlordInquiries.filter((i) => {
      const d = new Date(i.createdAt);
      return d >= start && d <= end;
    });
    const total = inRange.length;
    const read = inRange.filter((i) => i.status === "read").length;
    const unread = total - read;
    const readPct = total > 0 ? Math.round((read / total) * 100) : 0;
    return { total, read, unread, readPct };
  }, [landlordInquiries, filter, customDate]);

  const perPropertyEarnings = useMemo(() => {
    const map: Record<
      string,
      { title: string; earned: number; pending: number }
    > = {};
    payments.forEach((p) => {
      if (!map[p.propertyId])
        map[p.propertyId] = { title: "", earned: 0, pending: 0 };
      if (p.status === "completed")
        map[p.propertyId].earned += p.landlordAmount;
      if (p.status === "pending") map[p.propertyId].pending += p.amount;
    });
    properties.forEach((prop) => {
      if (map[prop._id]) map[prop._id].title = prop.title;
    });
    return Object.entries(map)
      .map(([id, val]) => ({ id, ...val }))
      .sort((a, b) => b.earned - a.earned)
      .slice(0, 4);
  }, [payments, properties]);

  const upcomingRent = payments
    .filter(
      (p) =>
        p.type === "rent" &&
        p.status === "pending" &&
        p.month === thisMonth &&
        p.year === thisYear,
    )
    .slice(0, 4);

  const recentPayments = [...completedPayments]
    .sort(
      (a, b) =>
        new Date(b.paidAt ?? b.createdAt).getTime() -
        new Date(a.paidAt ?? a.createdAt).getTime(),
    )
    .slice(0, 5);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filterLabel = FILTER_OPTIONS.find((f) => f.key === filter)?.label ?? "";
  const tickInterval =
    filter === "month" ? 4 : filter === "today" || filter === "custom" ? 3 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Hey {displayName}, welcome back 👋
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Here's what's happening with your properties
              </p>
            </div>

            <FilterBar
              active={filter}
              customDate={customDate}
              onChange={setFilter}
              onCustomChange={setCustomDate}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Home className="text-blue-600 w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {rangeAvailable} available
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Properties Added
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {rangeProperties.length}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Total: {totalProperties}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {rangeSentLeases.length} pending
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Active Leases
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {rangeActiveLeases.length}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Total active: {activeLeases.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-600 w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  {filterLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Earnings</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {fmt(rangeEarnings)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                All time: {fmt(allTimeEarnings)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="text-orange-500 w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                  {filteredPending.length} pending
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {fmt(rangePending)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                All time: {fmt(pendingAmount)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-600" />
                    Earnings Overview
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{filterLabel}</p>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Collected</p>
                    <p className="text-base font-bold text-emerald-600">
                      {fmt(rangeEarnings)}
                    </p>
                  </div>
                  <div className="w-px bg-slate-100" />
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Pending</p>
                    <p className="text-base font-bold text-orange-500">
                      {fmt(rangePending)}
                    </p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                  data={earningsBuckets}
                  margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    interval={tickInterval}
                  />
                  <YAxis
                    tickFormatter={fmtK}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                 <Tooltip content={<AreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="earned"
                    name="Collected"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#earnGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#10b981" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    name="Pending"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#pendGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#f97316" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-5 mt-3">
                {[
                  { color: "#10b981", label: "Collected" },
                  { color: "#f97316", label: "Pending" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  Revenue by Property Type
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{filterLabel}</p>
              </div>

              {revenueByType.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-56 text-slate-400 text-sm">
                  <Building2 className="w-8 h-8 mb-2 opacity-30" />
                  No data in this range
                </div>
              ) : (
                <>
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={revenueByType}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={78}
                          paddingAngle={3}
                          dataKey="earned"
                        >
                          {revenueByType.map((_, i) => (
                            <Cell
                              key={i}
                              fill={TYPE_COLORS[i % TYPE_COLORS.length]}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                      <Tooltip content={<PieTooltip />} />

                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-xs text-slate-400 font-medium">
                        Total
                      </p>
                      <p className="text-base font-bold text-slate-800">
                        {fmtK(revenueByType.reduce((s, d) => s + d.earned, 0))}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    {revenueByType.map((item, i) => {
                      const total = revenueByType.reduce(
                        (s, d) => s + d.earned,
                        0,
                      );
                      const pct =
                        total > 0 ? Math.round((item.earned / total) * 100) : 0;
                      return (
                        <div
                          key={item.type}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{
                                background: TYPE_COLORS[i % TYPE_COLORS.length],
                              }}
                            />
                            <span className="text-xs text-slate-600 font-medium capitalize">
                              {item.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                              {pct}%
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {fmtK(item.earned)}
                            </span>
                            {item.pending > 0 && (
                              <span className="text-xs text-orange-400 font-medium">
                                +{fmtK(item.pending)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {landlordInquiries.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Enquiry Status Overview
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Read vs Unread — {filterLabel}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/*  */}
                  <button
                    onClick={() => router.push("/landlord/enquiries")}
                    className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={inquiryChartData}
                      margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                      barSize={16}
                      barGap={4}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                   <Tooltip content={<BarTooltip />} />
                      <Bar
                        dataKey="read"
                        name="Read"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="unread"
                        name="Unread"
                        fill="#fbbf24"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-5 mt-2">
                    {[
                      { color: "#10b981", label: "Read" },
                      { color: "#fbbf24", label: "Unread" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-1.5"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span className="text-xs text-slate-500">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        label: "Total",
                        value: inquiryStats.total,
                        color: "bg-slate-100   text-slate-700",
                      },
                      {
                        label: "Read",
                        value: inquiryStats.read,
                        color: "bg-emerald-100 text-emerald-700",
                      },
                      {
                        label: "Unread",
                        value: inquiryStats.unread,
                        color: "bg-amber-100   text-amber-700",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`${item.color} rounded-xl p-3 text-center`}
                      >
                        <p className="text-xl font-bold">{item.value}</p>
                        <p className="text-xs font-semibold mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600">
                        Read Rate
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {inquiryStats.readPct}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${inquiryStats.readPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      {inquiryStats.read} of {inquiryStats.total} enquiries seen
                      by you
                    </p>
                  </div>

                  {inquiryStats.unread > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-700">
                          {inquiryStats.unread} unread{" "}
                          {inquiryStats.unread === 1 ? "enquiry" : "enquiries"}
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">
                          Respond quickly to improve tenant trust
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-emerald-600" />
                Lease Status
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Draft",
                    count: draftLeases.length,
                    color: "bg-slate-100   text-slate-600",
                  },
                  {
                    label: "Sent",
                    count: sentLeases.length,
                    color: "bg-blue-100    text-blue-600",
                  },
                  {
                    label: "Signed",
                    count: signedLeases.length,
                    color: "bg-purple-100  text-purple-600",
                  },
                  {
                    label: "Active",
                    count: activeLeases.length,
                    color: "bg-emerald-100 text-emerald-700",
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => router.push("/landlord/leases")}
                    className={`flex items-center justify-between p-3 rounded-xl ${item.color} hover:opacity-80 transition`}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-2xl font-bold">{item.count}</span>
                  </button>
                ))}
              </div>

              <h2 className="text-sm font-bold text-slate-700 mt-6 mb-3">
                Quick Actions
              </h2>
              <div className="space-y-1.5">
                {[
                  {
                    label: "Add New Property",
                    icon: Plus,
                    href: "/landlord/add-properties",
                  },
                  {
                    label: "Create Lease",
                    icon: ScrollText,
                    href: "/landlord/leases/create",
                  },
                  {
                    label: "View Payments",
                    icon: IndianRupee,
                    href: "/landlord/payments",
                  },
                  {
                    label: "Visit Requests",
                    icon: CalendarCheck,
                    href: "/landlord/visit-requests",
                  },
                  {
                    label: "Enquiries",
                    icon: MessageSquare,
                    href: "/landlord/enquiries",
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

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Per Property Earnings
                </h2>
                <button
                  onClick={() => router.push("/landlord/payments")}
                  className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {perPropertyEarnings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Building2 className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm">No payment data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {perPropertyEarnings.map((prop) => (
                    <div key={prop.id} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Home className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800 flex-1 truncate">
                          {prop.title ||
                            `Property #${prop.id.slice(-6).toUpperCase()}`}
                        </p>
                        <span className="text-sm font-bold text-emerald-600">
                          {fmt(prop.earned)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (prop.earned / (allTimeEarnings || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                        {prop.pending > 0 && (
                          <span className="text-xs text-orange-500 font-medium whitespace-nowrap">
                            +{fmt(prop.pending)} due
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {upcomingRent.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    Rent Due This Month
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {upcomingRent.map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center justify-between p-3 bg-orange-50 rounded-xl"
                      >
                        <div>
                          <p className="text-xs font-mono text-slate-500">
                            #{p.leaseId.slice(-8).toUpperCase()}
                          </p>
                          {p.dueDate && (
                            <p className="text-xs text-orange-500 font-medium">
                              Due {formatDate(p.dueDate)}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                          {fmt(p.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {recentPayments.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  Recent Payments Received
                </h2>
                <button
                  onClick={() => router.push("/landlord/payments")}
                  className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 font-semibold uppercase tracking-wide border-b border-slate-100">
                      <th className="text-left pb-3">Type</th>
                      <th className="text-left pb-3">Lease</th>
                      <th className="text-left pb-3">Date</th>
                      <th className="text-right pb-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentPayments.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-slate-50/50 transition"
                      >
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              p.type === "deposit"
                                ? "bg-blue-100   text-blue-700"
                                : p.type === "rent"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {p.type === "deposit"
                              ? "Deposit"
                              : p.type === "rent"
                                ? "Rent"
                                : p.type === "late_fee"
                                  ? "Late Fee"
                                  : p.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            #{p.leaseId.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 text-xs">
                          {p.paidAt ? formatDate(p.paidAt) : "—"}
                        </td>
                        <td className="py-3 text-right font-bold text-emerald-600">
                          {fmt(p.landlordAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
