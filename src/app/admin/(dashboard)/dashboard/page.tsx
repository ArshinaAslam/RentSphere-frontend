"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import { useRouter } from "next/navigation";

import {
  Users,
  Wallet,
  Building2,
  CreditCard,
  TrendingUp,
  BarChart2,
  UserCheck,
  Loader2,
  Home,
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
} from "recharts";

import {
  fetchLandlordsAsync,
  fetchTenantsAsync,
  fetchAdminProperties,
} from "@/features/admin/adminThunks";
import type { AdminProperty, Landlord } from "@/features/admin/types";
import {
  fetchRevenueStats,
  fetchMonthlyTrend,
  fetchAllTransactions,
} from "@/features/adminRevenue/adminRevenueThunk";
import type { AdminTransactionDto } from "@/features/adminRevenue/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/index";

interface TooltipProps {
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

interface LandlordRevenueMap {
  name: string;
  revenue: number;
  properties: number;
}

const MONTHS_SHORT = [
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
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PROPERTY_TYPE_COLORS = [
  "#7C3AED",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#f97316",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

const STATUS_COLORS: Record<string, string> = {
  completed: "#10b981",
  pending: "#f59e0b",
  failed: "#ef4444",
  refunded: "#8b5cf6",
};

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const fmtK = (n: number) =>
  n >= 1_00_000
    ? `₹${(n / 1_00_000).toFixed(1)}L`
    : n >= 1_000
      ? `₹${(n / 1_000).toFixed(1)}K`
      : `₹${n}`;

type FilterOption = "today" | "week" | "month" | "year" | "custom";

function getDateRange(
  filter: FilterOption,
  customDate?: string,
): { from: string; to: string } | undefined {
  const now = new Date();
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);
  const from = new Date(now);

  if (filter === "today") {
    from.setHours(0, 0, 0, 0);
  } else if (filter === "week") {
    from.setDate(now.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  } else if (filter === "month") {
    from.setDate(1);
    from.setHours(0, 0, 0, 0);
  } else if (filter === "year") {
    from.setMonth(0, 1);
    from.setHours(0, 0, 0, 0);
  } else if (filter === "custom" && customDate) {
    const d = new Date(customDate);
    d.setHours(0, 0, 0, 0);
    const end = new Date(customDate);
    end.setHours(23, 59, 59, 999);
    return { from: d.toISOString(), to: end.toISOString() };
  } else {
    return undefined;
  }

  return { from: from.toISOString(), to: to.toISOString() };
}

function filterToMonths(filter: FilterOption): number {
  if (filter === "today" || filter === "week") return 1;
  if (filter === "month") return 1;
  if (filter === "year") return 12;
  return 6;
}

function buildAdminChartData(
  payments: AdminTransactionDto[],
  filter: FilterOption,
  customDate?: string,
): { label: string; revenue: number; volume: number; count: number }[] {
  const now = new Date();
  let start = new Date();
  let end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (filter === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (filter === "week") {
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else if (filter === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (filter === "year") {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  } else if (filter === "custom" && customDate) {
    start = new Date(customDate);
    start.setHours(0, 0, 0, 0);
    end = new Date(customDate);
    end.setHours(23, 59, 59, 999);
  }

  const completed = payments.filter((p) => {
    if (p.status !== "completed") return false;
    const d = new Date(p.paidAt ?? p.createdAt);
    return d >= start && d <= end;
  });

  if (filter === "today" || filter === "custom") {
    const hours: Record<
      number,
      { revenue: number; volume: number; count: number }
    > = {};
    for (let h = 0; h < 24; h++) hours[h] = { revenue: 0, volume: 0, count: 0 };
    completed.forEach((p) => {
      const h = new Date(p.paidAt ?? p.createdAt).getHours();
      hours[h].revenue += p.platformFee ?? 0;
      hours[h].volume += p.amount ?? 0;
      hours[h].count += 1;
    });
    return Object.entries(hours).map(([h, v]) => ({
      label: `${String(h).padStart(2, "0")}:00`,
      ...v,
    }));
  }

  if (filter === "week") {
    const map: Record<
      number,
      { revenue: number; volume: number; count: number }
    > = {};
    DAYS_SHORT.forEach(
      (_, i) => (map[i] = { revenue: 0, volume: 0, count: 0 }),
    );
    completed.forEach((p) => {
      const d = new Date(p.paidAt ?? p.createdAt).getDay();
      map[d].revenue += p.platformFee ?? 0;
      map[d].volume += p.amount ?? 0;
      map[d].count += 1;
    });
    return DAYS_SHORT.map((label, i) => ({ label, ...map[i] }));
  }

  if (filter === "month") {
    const daysInMonth = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0,
    ).getDate();
    const map: Record<
      number,
      { revenue: number; volume: number; count: number }
    > = {};
    for (let d = 1; d <= daysInMonth; d++)
      map[d] = { revenue: 0, volume: 0, count: 0 };
    completed.forEach((p) => {
      const d = new Date(p.paidAt ?? p.createdAt).getDate();
      map[d].revenue += p.platformFee ?? 0;
      map[d].volume += p.amount ?? 0;
      map[d].count += 1;
    });
    return Object.entries(map).map(([d, v]) => ({ label: String(d), ...v }));
  }

  if (filter === "year") {
    const map: Record<
      number,
      { revenue: number; volume: number; count: number }
    > = {};
    MONTHS_SHORT.forEach(
      (_, i) => (map[i] = { revenue: 0, volume: 0, count: 0 }),
    );
    completed.forEach((p) => {
      const m = new Date(p.paidAt ?? p.createdAt).getMonth();
      map[m].revenue += p.platformFee ?? 0;
      map[m].volume += p.amount ?? 0;
      map[m].count += 1;
    });
    return MONTHS_SHORT.map((label, i) => ({ label, ...map[i] }));
  }

  return [];
}

const AreaTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.dataKey === "count" ? p.value : fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const DonutTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold capitalize" style={{ color: item.color }}>
        {item.name}
      </p>
      <p className="text-slate-700 font-semibold">{item.value} properties</p>
    </div>
  );
};

const PaymentTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }} className="font-semibold">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "custom", label: "Custom" },
];

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { stats, isLoadingStats, isLoadingTrend } = useAppSelector(
    (s: RootState) => s.adminRevenue,
  );

  const landlordTotal = useAppSelector((s: RootState) => s.admin.landlordTotal);
  const tenantTotal = useAppSelector((s: RootState) => s.admin.tenantTotal);

  const allProperties = useAppSelector((s) => s.admin.properties ?? []);
  const allPayments = useAppSelector((s) => s.adminRevenue.transactions ?? []);
  const allLandlords = useAppSelector(
    (s: RootState) => s.admin.landlords ?? [],
  );

  const [activeFilter, setActiveFilter] = useState<FilterOption>("month");
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const loadAll = useCallback(() => {
    const range = getDateRange(activeFilter, customDate);
    const months = filterToMonths(activeFilter);

    void dispatch(fetchRevenueStats(range));
    void dispatch(fetchMonthlyTrend({ months }));
    void dispatch(
      fetchAllTransactions(range ? { ...range, limit: 500 } : { limit: 500 }),
    );
    void dispatch(
      fetchAdminProperties(range ? { ...range, limit: 500 } : { limit: 500 }),
    );
    void dispatch(
      fetchLandlordsAsync({ search: "", page: 1, limit: 100, ...range }),
    );
    void dispatch(
      fetchTenantsAsync({ search: "", page: 1, limit: 5, ...range }),
    );
  }, [dispatch, activeFilter, customDate]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);
  useEffect(() => {
    if (activeFilter === "custom" && customDate) loadAll();
  }, [customDate]);

  const chartData = useMemo(
    () => buildAdminChartData(allPayments, activeFilter, customDate),
    [allPayments, activeFilter, customDate],
  );

  const tickInterval =
    activeFilter === "month"
      ? 4
      : activeFilter === "today" || activeFilter === "custom"
        ? 3
        : 0;

  const propertyTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    allProperties.forEach((p: AdminProperty) => {
      const type = p.type ?? "Other";
      map[type] = (map[type] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value], i) => ({
        name,
        value,
        color: PROPERTY_TYPE_COLORS[i % PROPERTY_TYPE_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [allProperties]);

  const totalProperties = allProperties.length;

  const revenueByTypeData = useMemo(() => {
    const propTypeMap: Record<string, string> = {};
    allProperties.forEach((p: AdminProperty) => {
      propTypeMap[p._id] = p.type ?? "Other";
    });

    const map: Record<string, number> = {};
    const range = getDateRange(activeFilter, customDate);

    const filtered = allPayments.filter((p: AdminTransactionDto) => {
      if (p.status !== "completed") return false;
      if (!range) return true;
      const d = new Date(p.paidAt ?? p.createdAt);
      return d >= new Date(range.from) && d <= new Date(range.to);
    });

    filtered.forEach((p: AdminTransactionDto) => {
      const type = propTypeMap[p.propertyId];
      if (!type) return;
      map[type] = (map[type] ?? 0) + p.platformFee;
    });

    if (Object.keys(map).length === 0) return [];

    return Object.entries(map)
      .map(([type, revenue], i) => ({
        type,
        revenue,
        color: PROPERTY_TYPE_COLORS[i % PROPERTY_TYPE_COLORS.length],
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [allProperties, allPayments, activeFilter, customDate]);

  const paymentStatusData = useMemo(() => {
    const map: Record<string, number> = { completed: 0, pending: 0, failed: 0 };
    const range = getDateRange(activeFilter, customDate);

    const filtered = allPayments.filter((p: AdminTransactionDto) => {
      if (!range) return true;
      const d = new Date(p.paidAt ?? p.createdAt);
      return d >= new Date(range.from) && d <= new Date(range.to);
    });

    filtered.forEach((p: AdminTransactionDto) => {
      if (p.status in map) map[p.status] += p.amount;
    });

    return Object.entries(map)
      .map(([status, amount]) => ({
        status,
        amount,
        color: STATUS_COLORS[status] ?? "#94a3b8",
      }))
      .filter((d) => d.amount > 0);
  }, [allPayments, activeFilter, customDate]);

  const totalPaymentVolume = paymentStatusData.reduce(
    (s, d) => s + d.amount,
    0,
  );

  const topLandlords = useMemo(() => {
    const map: Record<string, LandlordRevenueMap> = {};
    const range = getDateRange(activeFilter, customDate);

    const filtered = allPayments.filter((p: AdminTransactionDto) => {
      if (p.status !== "completed") return false;
      if (!range) return true;
      const d = new Date(p.paidAt ?? p.createdAt);
      return d >= new Date(range.from) && d <= new Date(range.to);
    });

    filtered.forEach((p: AdminTransactionDto) => {
      const id = p.landlordId;
      if (!map[id]) map[id] = { name: "", revenue: 0, properties: 0 };
      map[id].revenue += p.landlordAmount;
    });

    allLandlords.forEach((l: Landlord) => {
      if (map[l.id]) map[l.id].name = l.fullName;
    });

    return Object.entries(map)
      .map(([id, val]) => ({ id, ...val }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [allPayments, allLandlords, activeFilter, customDate]);

  const maxLandlordRevenue = topLandlords[0]?.revenue ?? 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    activeFilter === f.key
                      ? "bg-violet-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {activeFilter === "custom" && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="h-9 px-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              />
            )}
          </div>
        </div>

        {isLoadingStats ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Wallet className="w-5 h-5 text-violet-600" />}
              bg="bg-violet-100"
              label="Total Revenue"
              value={fmt(stats.totalRevenue)}
              sub="Platform fees collected"
              onClick={() => router.push("/admin/revenue")}
            />
            <StatCard
              icon={<Building2 className="w-5 h-5 text-blue-600" />}
              bg="bg-blue-100"
              label="Total Properties"
              value={String(totalProperties || stats.totalCount || 0)}
              sub="Across all landlords"
              onClick={() => router.push("/admin/properties")}
            />
            <StatCard
              icon={<Home className="w-5 h-5 text-purple-600" />}
              bg="bg-purple-100"
              label="Total Landlords"
              value={String(landlordTotal)}
              sub="Registered in period"
              onClick={() => router.push("/admin/landlord-listing-page")}
            />
            <StatCard
              icon={<Users className="w-5 h-5 text-emerald-600" />}
              bg="bg-emerald-100"
              label="Total Tenants"
              value={String(tenantTotal)}
              sub="Registered in period"
              onClick={() => router.push("/admin/tenant-listing-page")}
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-violet-600" />
                  Revenue Overview
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeFilter === "month"
                    ? "Day-by-day this month"
                    : activeFilter === "year"
                      ? "Month-by-month this year"
                      : activeFilter === "week"
                        ? "Day-by-day this week"
                        : activeFilter === "today"
                          ? "Hour-by-hour today"
                          : "Custom range — hourly"}
                </p>
              </div>
              {stats && (
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Fee</p>
                  <p className="text-sm font-bold text-violet-600">
                    {fmt(stats.totalRevenue)}
                  </p>
                </div>
              )}
            </div>

            {isLoadingTrend ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No data for this period
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#7C3AED"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#7C3AED"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="volumeGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
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
                      dataKey="revenue"
                      name="Platform Fee"
                      stroke="#7C3AED"
                      strokeWidth={2}
                      fill="url(#revenueGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#7C3AED" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      name="Total Volume"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#volumeGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#10b981" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-5 mt-2">
                  {[
                    { color: "#7C3AED", label: "Platform Fee" },
                    { color: "#10b981", label: "Total Volume" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
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
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-0.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              Property Types
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Distribution across platform
            </p>

            {propertyTypeData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <Building2 className="w-8 h-8 opacity-30" />
                No properties yet
              </div>
            ) : (
              <>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={74}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {propertyTypeData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<DonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xs text-slate-400 font-medium">Total</p>
                    <p className="text-lg font-bold text-slate-800">
                      {totalProperties}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-1">
                  {propertyTypeData.map((item) => {
                    const pct =
                      totalProperties > 0
                        ? Math.round((item.value / totalProperties) * 100)
                        : 0;
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: item.color }}
                          />
                          <span className="text-xs text-slate-600 font-medium capitalize">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{pct}%</span>
                          <span className="text-xs font-bold text-slate-700">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-0.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Payment Status Breakdown
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Volume by status across platform
            </p>

            {paymentStatusData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-sm gap-2">
                <CreditCard className="w-8 h-8 opacity-30" />
                No payment data yet
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {paymentStatusData.map((item) => (
                    <div
                      key={item.status}
                      className="rounded-xl p-3 text-center"
                      style={{ background: item.color + "18" }}
                    >
                      <p
                        className="text-base font-bold"
                        style={{ color: item.color }}
                      >
                        {fmtK(item.amount)}
                      </p>
                      <p
                        className="text-xs font-semibold mt-0.5 capitalize"
                        style={{ color: item.color }}
                      >
                        {item.status}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {paymentStatusData.map((item) => {
                    const pct =
                      totalPaymentVolume > 0
                        ? Math.round((item.amount / totalPaymentVolume) * 100)
                        : 0;
                    return (
                      <div key={item.status}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: item.color }}
                            />
                            <span className="text-xs font-semibold capitalize text-slate-600">
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                              {pct}%
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {fmt(item.amount)}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: item.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-0.5">
              <TrendingUp className="w-4 h-4 text-violet-600" />
              Revenue by Property Type
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Platform fee earned per property category
            </p>

            {revenueByTypeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-sm gap-2">
                <TrendingUp className="w-8 h-8 opacity-30" />
                No data yet
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={revenueByTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={74}
                      paddingAngle={3}
                      dataKey="revenue"
                    >
                      {revenueByTypeData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<PaymentTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-1.5 mt-3">
                  {revenueByTypeData.map((item) => {
                    const total = revenueByTypeData.reduce(
                      (s, d) => s + d.revenue,
                      0,
                    );
                    const pct =
                      total > 0 ? Math.round((item.revenue / total) * 100) : 0;
                    return (
                      <div
                        key={item.type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: item.color }}
                          />
                          <span className="text-xs text-slate-600 capitalize font-medium">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{pct}%</span>
                          <span className="text-xs font-bold text-slate-700">
                            {fmtK(item.revenue)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  Top Performing Landlords
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  By total revenue generated
                </p>
              </div>
            </div>

            {topLandlords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-sm gap-2">
                <UserCheck className="w-8 h-8 opacity-30" />
                No data yet
              </div>
            ) : (
              <div className="space-y-3">
                {topLandlords.map((landlord, i) => (
                  <div key={landlord.id} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0
                          ? "bg-amber-100 text-amber-600"
                          : i === 1
                            ? "bg-slate-100 text-slate-500"
                            : i === 2
                              ? "bg-orange-100 text-orange-500"
                              : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {landlord.name ||
                            `Landlord #${landlord.id.slice(-6).toUpperCase()}`}
                        </p>
                        <span className="text-xs font-bold text-violet-600 ml-2 flex-shrink-0">
                          {fmtK(landlord.revenue)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (landlord.revenue / maxLandlordRevenue) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  bg,
  label,
  value,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-left hover:shadow-md hover:border-violet-200 transition-all w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
        <p className="text-xs font-medium text-slate-500 leading-tight">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </button>
  );
}
