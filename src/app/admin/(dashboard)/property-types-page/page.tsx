"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import {
  fetchPropertyTypes,
  addPropertyType,
  togglePropertyType,
  deletePropertyType,
} from "@/features/adminPropertyType/adminPropertyTypeThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const LIMIT = 5;

export default function PropertyTypesPage() {
  const dispatch = useAppDispatch();
  const { propertyTypes, isLoading, total, page } = useAppSelector(
    (s) => s.adminPropertyTypes,
  );

  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "toggle" | "delete";
    propertyTypeId: string;
    name: string;
    isActive?: boolean;
  }>({ open: false, type: "toggle", propertyTypeId: "", name: "" });

  const totalPages = Math.ceil(total / LIMIT);

  const loadTypes = (p: number) => {
    void dispatch(fetchPropertyTypes({ page: p, limit: LIMIT }));
  };

  useEffect(() => {
    loadTypes(currentPage);
  }, [currentPage]);

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error("Enter a name");
      return;
    }
    setAdding(true);
    const result = await dispatch(addPropertyType({ name: newName.trim() }));
    if (addPropertyType.fulfilled.match(result)) {
      toast.success("Added!");
      setNewName("");
      loadTypes(currentPage);
    } else {
      toast.error(result.payload?.message ?? "Failed to add");
    }
    setAdding(false);
  };

  const handleConfirmAction = async () => {
    const { type, propertyTypeId } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, open: false }));

    if (type === "toggle") {
      const result = await dispatch(togglePropertyType(propertyTypeId));
      if (!togglePropertyType.fulfilled.match(result))
        toast.error("Failed to update");
    } else {
      const result = await dispatch(deletePropertyType(propertyTypeId));
      if (deletePropertyType.fulfilled.match(result)) {
        toast.success("Deleted");
        if (propertyTypes.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        } else {
          loadTypes(currentPage);
        }
      } else {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Property Types</h1>
            <p className="text-slate-500 text-sm">
              Manage property types shown to landlords
            </p>
          </div>
        </div>

        {/* Confirmation Modal */}
        {confirmModal.open && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() =>
                setConfirmModal((prev) => ({ ...prev, open: false }))
              }
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-amber-100">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 text-center mb-1">
                  {confirmModal.type === "delete"
                    ? "Delete Property Type?"
                    : confirmModal.isActive
                      ? "Deactivate Type?"
                      : "Activate Type?"}
                </h3>
                <p className="text-sm text-slate-500 text-center mb-6">
                  {confirmModal.type === "delete"
                    ? `"${confirmModal.name}" will be permanently removed.`
                    : `"${confirmModal.name}" will be ${confirmModal.isActive ? "deactivated and hidden from landlords" : "activated and shown to landlords"}.`}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setConfirmModal((prev) => ({ ...prev, open: false }))
                    }
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => void handleConfirmAction()}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition ${
                      confirmModal.type === "delete"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {confirmModal.type === "delete"
                      ? "Delete"
                      : confirmModal.isActive
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Add New Type
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleAdd()}
              placeholder="e.g. Apartment, Villa, Studio..."
              className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={() => void handleAdd()}
              disabled={adding}
              className="flex items-center gap-2 px-4 h-10 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-14">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : propertyTypes.length === 0 ? (
            <div className="text-center py-14 text-slate-400 text-sm">
              No property types yet
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-50">
                {propertyTypes.map((type) => (
                  <div
                    key={type._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${type.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      <span
                        className={`text-sm font-medium ${type.isActive ? "text-slate-800" : "text-slate-400 line-through"}`}
                      >
                        {type.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            type: "toggle",
                            propertyTypeId: type._id,
                            name: type.name,
                            isActive: type.isActive,
                          })
                        }
                        className="text-slate-400 hover:text-purple-600 transition"
                        title={type.isActive ? "Deactivate" : "Activate"}
                      >
                        {type.isActive ? (
                          <ToggleRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            type: "delete",
                            propertyTypeId: type._id,
                            name: type.name,
                          })
                        }
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Page {page} of {totalPages} · {total} total
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1.5 text-xs rounded-lg border bg-purple-600 text-white border-purple-600 font-medium">
                      {currentPage}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
