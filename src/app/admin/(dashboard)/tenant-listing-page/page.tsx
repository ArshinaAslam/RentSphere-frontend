"use client";

import { useEffect, useState } from "react";

import { Search, Ban, CheckCircle, Loader2 } from "lucide-react";

import UserTable from "@/components/admin/UserTable";
import {
  clearError,
  setSearch,
  setCurrentPage,
} from "@/features/admin/adminSlice";
import {
  fetchTenantsAsync,
  toggleTenantStatusAsync,
} from "@/features/admin/adminThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const TenantListingPage = () => {
  const dispatch = useAppDispatch();
  const {
    tenants,
    tenantTotal,
    currentPage,
    totalPages,
    search,
    isLoading,
    error,
  } = useAppSelector((state) => state.admin);

  const limit = 5;

  const [selectedTenant, setSelectedTenant] = useState<{
    id: string;
    name: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    void dispatch(fetchTenantsAsync({ search, page: currentPage, limit }));
  }, [dispatch, search, currentPage]);

  const handleToggleStatus = (
    id: string,
    currentStatus: string,
    name: string,
  ) => {
    setSelectedTenant({ id, name, status: currentStatus });
  };

  const confirmToggle = () => {
    if (!selectedTenant) return;
    const newStatus = selectedTenant.status === "active" ? "blocked" : "active";
    void dispatch(
      toggleTenantStatusAsync({ id: selectedTenant.id, status: newStatus }),
    );
    setSelectedTenant(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const goToPage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (isLoading && tenants.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A5ACD]" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-700 flex flex-col items-center">
        {/* Header */}
        <div className="w-full max-w-5xl">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage tenants and landlords
          </p>
        </div>

        <div className="w-full max-w-5xl">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#6A5ACD]/10 focus:border-[#6A5ACD] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-5xl p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex justify-between items-center">
            {error}
            <button
              onClick={() => dispatch(clearError())}
              className="font-bold underline uppercase text-[10px]"
            >
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        <div className="w-full max-w-5xl">
          <UserTable
            rows={tenants}
            total={tenantTotal}
            currentPage={currentPage}
            totalPages={totalPages}
            onToggle={handleToggleStatus}
            onPageChange={goToPage}
          />
        </div>
      </div>

      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setSelectedTenant(null)}
          />

          <div className="relative bg-white w-[420px] rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedTenant.status === "active"
                    ? "bg-rose-100"
                    : "bg-emerald-100"
                }`}
              >
                {selectedTenant.status === "active" ? (
                  <Ban className="w-7 h-7 text-rose-600" />
                ) : (
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                )}
              </div>
            </div>

            <h3 className="text-center text-xl font-bold text-slate-900 mb-2">
              {selectedTenant.status === "active"
                ? "Block this user?"
                : "Unblock this user?"}
            </h3>

            <p className="text-center text-sm text-slate-500 mb-8 leading-relaxed">
              You are about to{" "}
              <span className="font-semibold text-slate-800">
                {selectedTenant.status === "active" ? "block" : "unblock"}
              </span>{" "}
              <span className="font-semibold text-slate-900">
                {selectedTenant.name}
              </span>
              .
              <br />
              This action can be changed later.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTenant(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmToggle}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                  selectedTenant.status === "active"
                    ? "bg-rose-600 hover:bg-rose-700 text-black"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {selectedTenant.status === "active"
                  ? "Block User"
                  : "Unblock User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TenantListingPage;
