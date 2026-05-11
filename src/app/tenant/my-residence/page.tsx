"use client";

import { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Building2,
  MapPin,
  Calendar,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { fetchTenantLeases } from "@/features/lease/leaseThunk";
import type { Lease } from "@/features/lease/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  expired: {
    label: "Expired",
    color: "bg-orange-100 text-orange-700",
    icon: Clock,
  },
  terminated: {
    label: "Terminated",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
} as const;

type ValidStatus = keyof typeof STATUS_CONFIG;

export default function MyResidenceListPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { leases = [], isLoading } = useAppSelector((s) => s.lease);

  useEffect(() => {
    void dispatch(fetchTenantLeases());
  }, [dispatch]);

  const residences = leases.filter((l) =>
    ["active", "expired", "terminated"].includes(l.status),
  );

  const activeLease = residences.find((l) => l.status === "active");
  const pastLeases = residences.filter((l) => l.status !== "active");

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Sidebar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)] pt-16 pl-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">My Residences</h1>
            <p className="text-slate-500 text-sm mt-1">
              Your current and past living properties
            </p>
          </div>

          {residences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-slate-700 font-semibold mb-1">
                No residences yet
              </h3>
              <p className="text-slate-400 text-sm">
                Properties you've lived in will appear here once your lease is
                active
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeLease && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Currently Living Here
                  </p>
                  <ResidenceCard
                    lease={activeLease}
                    onClick={() =>
                      router.push(`/tenant/my-residence/${activeLease._id}`)
                    }
                    formatDate={formatDate}
                  />
                </div>
              )}

              {pastLeases.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Past Residences
                  </p>
                  <div className="space-y-3">
                    {pastLeases.map((lease) => (
                      <ResidenceCard
                        key={lease._id}
                        lease={lease}
                        onClick={() =>
                          router.push(`/tenant/my-residence/${lease._id}`)
                        }
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ResidenceCard({
  lease,
  onClick,
  formatDate,
}: {
  lease: Lease;
  onClick: () => void;
  formatDate: (d: string) => string;
}) {
  const property =
    typeof lease.propertyId === "object" ? lease.propertyId : null;
  const status = lease.status as ValidStatus;
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;
  const isActive = status === "active";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 ${
        isActive
          ? "border-emerald-200 hover:border-emerald-300"
          : "border-slate-100 hover:border-slate-200"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
          {property?.images?.[0] ? (
            // <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
            <Image
              src={property.images[0]}
              alt={property.title ?? "Property"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-300" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-slate-900 truncate">
              {property?.title ?? "Property"}
            </p>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>

          {property?.city && (
            <p className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
              <MapPin className="w-3 h-3" />
              {property.address ? `${property.address}, ` : ""}
              {property.city}
            </p>
          )}

          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formatDate(lease.startDate)} → {formatDate(lease.endDate)}
          </p>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>
    </button>
  );
}
