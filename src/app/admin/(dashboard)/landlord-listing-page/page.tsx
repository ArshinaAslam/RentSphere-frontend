"use client";

import { useEffect, useState } from "react";

import { Search, Loader2, Ban, CheckCircle } from "lucide-react";

import UserTable from "@/components/admin/UserTable";
import {
  clearError,
  setCurrentPage,
  setSearch,
} from "@/features/admin/adminSlice";
import {
  fetchLandlordsAsync,
  toggleLandlordStatusAsync,
} from "@/features/admin/adminThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const LandlordListingPage = () => {
  const dispatch = useAppDispatch();

  const {
    landlords,
    landlordTotal,
    currentPage,
    totalPages,
    search,
    isLoading,
    error,
  } = useAppSelector((state) => state.admin);

  const limit = 3;

  const [selectedLandlord, setSelectedLandlord] = useState<{
    id: string;
    name: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    void dispatch(fetchLandlordsAsync({ search, page: currentPage, limit }));
  }, [dispatch, search, currentPage]);

  const handleToggleStatus = (
    id: string,
    currentStatus: string,
    name: string,
  ) => {
    setSelectedLandlord({ id, name, status: currentStatus });
  };

  const confirmToggle = () => {
    if (!selectedLandlord) return;

    const newStatus =
      selectedLandlord.status === "active" ? "blocked" : "active";

    void dispatch(
      toggleLandlordStatusAsync({
        landlordId: selectedLandlord.id,
        status: newStatus,
      }),
    );

    setSelectedLandlord(null);
  };

  if (isLoading && landlords.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#6A5ACD]" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-700">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Landlord Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage landlords and their KYC verification
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search landlords..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#6A5ACD]/10 focus:border-[#6A5ACD] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex justify-between items-center">
            {error}
            <button
              onClick={() => dispatch(clearError())}
              className="font-bold underline uppercase text-[10px]"
            >
              Clear
            </button>
          </div>
        )}

        <UserTable
          rows={landlords}
          total={landlordTotal}
          currentPage={currentPage}
          totalPages={totalPages}
          showKyc
          detailHref={(id) => `/admin/landlord-listing-page/${id}/details`}
          onToggle={handleToggleStatus}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      </div>

      {selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setSelectedLandlord(null)}
          />

          <div className="relative bg-white w-[420px] rounded-3xl shadow-2xl p-8">
            <div className="flex justify-center mb-5">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedLandlord.status === "active"
                    ? "bg-rose-100"
                    : "bg-emerald-100"
                }`}
              >
                {selectedLandlord.status === "active" ? (
                  <Ban className="w-7 h-7 text-rose-600" />
                ) : (
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                )}
              </div>
            </div>

            <h3 className="text-center text-xl font-bold text-slate-900 mb-2">
              {selectedLandlord.status === "active"
                ? "Block this landlord?"
                : "Unblock this landlord?"}
            </h3>

            <p className="text-center text-sm text-slate-500 mb-8">
              You are about to{" "}
              <span className="font-semibold">
                {selectedLandlord.status === "active" ? "block" : "unblock"}
              </span>{" "}
              <span className="font-semibold">{selectedLandlord.name}</span>.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedLandlord(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmToggle}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white ${
                  selectedLandlord.status === "active"
                    ? "bg-red-600 hover:bg-rose-700 text-black"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandlordListingPage;
