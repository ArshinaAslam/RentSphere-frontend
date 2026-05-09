"use client";

import { useEffect, useState, useCallback } from "react";

import EmojiPicker from "emoji-picker-react";
import {
  Sparkles,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  fetchAmenities,
  addAmenity,
  toggleAmenity,
  deleteAmenity,
} from "@/features/adminAmenity/adminAmenityThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import type { EmojiClickData } from "emoji-picker-react";

const LIMIT = 5;

export default function AmenitiesPage() {
  const dispatch = useAppDispatch();
  const { amenities, isLoading, total, page } = useAppSelector(
    (s) => s.adminAmenity,
  );

  const [newLabel, setNewLabel] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const [adding, setAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "toggle" | "delete";
    id: string;
    label: string;
    isActive?: boolean;
  }>({ open: false, type: "toggle", id: "", label: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const totalPages = Math.ceil(total / LIMIT);

  const loadAmenities = useCallback(
    (p: number, s: string) => {
      void dispatch(fetchAmenities({ page: p, limit: LIMIT, search: s }));
    },
    [dispatch],
  );

  useEffect(() => {
    loadAmenities(currentPage, search);
  }, [currentPage, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".emoji-picker-wrapper")) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleAdd = async () => {
    if (!newLabel.trim()) {
      toast.error("Enter a label");
      return;
    }
    if (!newEmoji.trim()) {
      toast.error("Enter an emoji");
      return;
    }
    setAdding(true);
    const result = await dispatch(
      addAmenity({ label: newLabel.trim(), emoji: newEmoji.trim() }),
    );
    if (addAmenity.fulfilled.match(result)) {
      toast.success("Added!");
      setNewLabel("");
      setNewEmoji("");
      loadAmenities(currentPage, search);
    } else {
      toast.error(result.payload?.message ?? "Failed to add");
    }
    setAdding(false);
  };

  const handleConfirmAction = async () => {
    const { type, id } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, open: false }));

    if (type === "toggle") {
      const result = await dispatch(toggleAmenity(id));
      if (!toggleAmenity.fulfilled.match(result))
        toast.error("Failed to update");
    } else {
      const result = await dispatch(deleteAmenity(id));
      if (deleteAmenity.fulfilled.match(result)) {
        toast.success("Deleted");
        if (amenities.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        } else {
          loadAmenities(currentPage, search);
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
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Amenities</h1>
            <p className="text-slate-500 text-sm">
              Manage amenities shown to landlords
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
                    ? "Delete Amenity?"
                    : confirmModal.isActive
                      ? "Deactivate Amenity?"
                      : "Activate Amenity?"}
                </h3>
                <p className="text-sm text-slate-500 text-center mb-6">
                  {confirmModal.type === "delete"
                    ? `"${confirmModal.label}" will be permanently removed.`
                    : `"${confirmModal.label}" will be ${confirmModal.isActive ? "deactivated and hidden from landlords" : "activated and shown to landlords"}.`}
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
                        : "bg-amber-500 hover:bg-amber-600"
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

        {/* Add new */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Add New Amenity
          </p>
          <div className="flex gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((p) => !p)}
                className="w-12 h-10 text-xl border border-slate-200 rounded-xl hover:border-amber-400 transition flex items-center justify-center bg-white"
              >
                {newEmoji || "😀"}
              </button>
              {showEmojiPicker && (
                <div className="absolute top-12 left-0 z-50">
                  <EmojiPicker
                    onEmojiClick={(data: EmojiClickData) => {
                      setNewEmoji(data.emoji);
                      setShowEmojiPicker(false);
                    }}
                    height={350}
                    width={300}
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleAdd()}
              placeholder="e.g. WiFi, Parking, Gym..."
              className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={() => void handleAdd()}
              disabled={adding}
              className="flex items-center gap-2 px-4 h-10 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
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

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search amenities..."
            className="w-full h-10 pl-9 pr-4 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-14">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : amenities.length === 0 ? (
            <div className="text-center py-14 text-slate-400 text-sm">
              {search
                ? `No amenities found for "${search}"`
                : "No amenities yet"}
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-50">
                {amenities.map((amenity) => (
                  <div
                    key={amenity._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${amenity.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      <span className="text-lg">{amenity.emoji}</span>
                      <span
                        className={`text-sm font-medium ${amenity.isActive ? "text-slate-800" : "text-slate-400 line-through"}`}
                      >
                        {amenity.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            type: "toggle",
                            id: amenity._id,
                            label: amenity.label,
                            isActive: amenity.isActive,
                          })
                        }
                        className="text-slate-400 hover:text-amber-600 transition"
                        title={amenity.isActive ? "Deactivate" : "Activate"}
                      >
                        {amenity.isActive ? (
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
                            id: amenity._id,
                            label: amenity.label,
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
                    <span className="px-3 py-1.5 text-xs rounded-lg border bg-amber-500 text-white border-amber-500 font-medium">
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
