"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ChevronLeft,
  Loader2,
  BedDouble,
  Bath,
  Maximize,
  CheckCircle2,
  AlertTriangle,
  Star,
} from "lucide-react";

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import LeasesTable from "@/components/Lease/LeasesTable";
import PaymentsTable from "@/components/payments/PaymentTable";
import { Button } from "@/components/ui/button";
import { clearSelectedProperty } from "@/features/property/propertySlice";
import {
  deleteLandlordProperty,
  fetchLandlordPropertyById,
  fetchPropertyLeases,
  fetchPropertyPayments,
  fetchPropertyReviews,
} from "@/features/property/propertyThunk";
import type {
  PropertyLease,
  PropertyPayment,
  PropertyReview,
} from "@/features/property/types";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type Tab = "details" | "payments" | "leases" | "reviews";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [propertyLeases, setPropertyLeases] = useState<PropertyLease[]>([]);
  const [propertyPayments, setPropertyPayments] = useState<PropertyPayment[]>(
    [],
  );
  const [propertyReviews, setPropertyReviews] = useState<PropertyReview[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
 
  const [paymentsQuery, setPaymentsQuery] = useState({
    total: 0,
    page: 1,
    limit: 2,
    type: "",
    status: "",
  });

  const { selectedProperty, isLoading } = useAppSelector(
    (state: RootState) => state.property,
  );
  const [leasesQuery, setLeasesQuery] = useState({
    total: 0,
    page: 1,
    limit: 2,
    status: "",
  });
  const [reviewsQuery, setReviewsQuery] = useState({
    total: 0,
    page: 1,
    limit: 5,
  });

  const fetchLeases = async (page: number, limit: number, status: string) => {
    setTabLoading(true);
    try {
      const result = await dispatch(
        fetchPropertyLeases({
          propertyId,
          page,
          limit,
          status,
        }),
      ).unwrap();
      setPropertyLeases(result.leases);
      setLeasesQuery((prev) => ({
        ...prev,
        total: result.total,
        page,
        status,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setTabLoading(false);
    }
  };

  useEffect(() => {
    void dispatch(fetchLandlordPropertyById({ propertyId: propertyId }));
    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, propertyId]);
  useEffect(() => {
    if (!propertyId) return;

    const fetchTabData = async () => {
      setTabLoading(true);
      try {
        if (activeTab === "leases") {
          await fetchLeases(1, leasesQuery.limit, "");
        }
        if (activeTab === "payments") {
          await fetchPayments(1, paymentsQuery.limit, "", "");
        }
        if (activeTab === "reviews") {
          await fetchReviews(1, reviewsQuery.limit);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTabLoading(false);
      }
    };

    if (activeTab !== "details") void fetchTabData();
  }, [activeTab, propertyId]);

  const fetchPayments = async (
    page: number,
    limit: number,
    type: string,
    status: string,
  ) => {
    setTabLoading(true);
    try {
      const result = await dispatch(
        fetchPropertyPayments({
          propertyId,
          page,
          limit,
          type,
          status,
        }),
      ).unwrap();
      setPropertyPayments(result.payments);
      setPaymentsQuery((prev) => ({
        ...prev,
        total: result.total,
        page,
        type,
        status,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setTabLoading(false);
    }
  };
  const fetchReviews = async (page: number, limit: number) => {
    setTabLoading(true);
    try {
      const result = await dispatch(
        fetchPropertyReviews({ propertyId, page, limit }),
      ).unwrap();

      setPropertyReviews(result.reviews);
      setReviewsQuery((prev) => ({
        ...prev,
        total: result?.total,
        page,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setTabLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await dispatch(deleteLandlordProperty(propertyId)).unwrap();
      router.push("/landlord/my-properties");
    } catch {
      setDeleteError("Failed to delete property");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LandlordNavbar />
        <LandlordSidebar />
        <main className="pl-64 pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-slate-500 text-sm">
              Loading property details...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!selectedProperty) return null;

  let displayAmenities: string[] = [];
  try {
    if (
      Array.isArray(selectedProperty.amenities) &&
      selectedProperty.amenities.length > 0
    ) {
      const first = selectedProperty.amenities[0];
      displayAmenities =
        typeof first === "string" && first.startsWith("[")
          ? (JSON.parse(first) as string[])
          : selectedProperty.amenities;
    }
  } catch {
    displayAmenities = selectedProperty.amenities || [];
  }

  const images = selectedProperty.images || [];
  const hasMultipleImages = images.length > 1;

  const goToPrev = () =>
    setCurrentImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const goToNext = () =>
    setCurrentImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  const TABS: { key: Tab; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "payments", label: "Payment History" },
    { key: "leases", label: "Lease History" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandlordNavbar />
      <LandlordSidebar />

      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full">
              <div className="p-8 pb-4 border-b border-slate-100 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">
                  Delete Property
                </h2>
                <p className="text-slate-500 text-sm">
                  This action{" "}
                  <span className="font-semibold text-red-600">
                    cannot be undone
                  </span>
                  . Are you sure?
                </p>
              </div>
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded-full">
                    #{propertyId.slice(-6).toUpperCase()}
                  </span>
                  <span className="font-semibold text-slate-800 truncate">
                    {selectedProperty.title}
                  </span>
                </div>
              </div>
              {deleteError && (
                <div className="p-4 border-b border-slate-100">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-800 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{deleteError}</span>
                  </div>
                </div>
              )}
              <div className="p-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 h-11 rounded-xl font-semibold"
                  onClick={() => void handleDeleteConfirm()}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete Property"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Full view"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
            >
              ✕ Close
            </button>
            <p className="text-center text-white/50 text-xs mt-3">
              {images.indexOf(lightboxImage) + 1} / {images.length}
            </p>
          </div>
        </div>
      )}

      <main className="pl-64 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Back */}
          <Link
            href="/landlord/my-properties"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Return to My Properties
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                {selectedProperty.status}
              </span>
              <span className="text-xs bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded-full">
                #{propertyId.slice(-6).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">My Property</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your listed property
            </p>
          </div>

          <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "details" && (
            <>
              {images.length > 0 && (
                <div className="relative rounded-2xl overflow-hidden h-72 group">
                  <img
                    src={images[currentImageIndex]}
                    alt={`Property image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={goToPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xl transition opacity-0 group-hover:opacity-100"
                      >
                        ‹
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xl transition opacity-0 group-hover:opacity-100"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`rounded-full transition-all duration-300 ${i === currentImageIndex ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div className="absolute top-3 right-3 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                  <div
                    className="absolute inset-0 z-0 cursor-zoom-in"
                    onClick={() => setLightboxImage(images[currentImageIndex])}
                  />
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedProperty.title}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      #{propertyId.slice(-6).toUpperCase()} ·{" "}
                      {selectedProperty.city}, {selectedProperty.state}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{selectedProperty.price?.toLocaleString("en-IN") ?? 0}
                    </p>
                    <p className="text-xs text-slate-400">per month</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-4 py-4 border-y border-slate-100">
                  {selectedProperty.bedrooms && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <BedDouble className="w-4 h-4" />
                      </div>
                      {selectedProperty.bedrooms} Bedrooms
                    </div>
                  )}
                  {selectedProperty.bathrooms && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Bath className="w-4 h-4" />
                      </div>
                      {selectedProperty.bathrooms} Bathrooms
                    </div>
                  )}
                  {selectedProperty.area && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Maximize className="w-4 h-4" />
                      </div>
                      {selectedProperty.area} sq.ft
                    </div>
                  )}
                  {selectedProperty.furnishing && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {selectedProperty.furnishing}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3 mt-5">
                  {[
                    {
                      label: "Security Dep.",
                      value: `₹${selectedProperty.securityDeposit?.toLocaleString("en-IN") ?? 0}`,
                    },
                    {
                      label: "Property Type",
                      value: selectedProperty.type ?? "-",
                    },
                    { label: "BHK", value: selectedProperty.bhk ?? "-" },
                    {
                      label: "Vacant Units",
                      value: String(selectedProperty.vacant ?? 0),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-slate-50 rounded-xl p-3"
                    >
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-800 mb-3">
                  About this property
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedProperty.description || "No description available."}
                </p>
              </div>

              {displayAmenities.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-base font-bold text-slate-800 mb-4">
                    What this place offers
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {displayAmenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-red-50/50 rounded-2xl border border-red-100 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-900">
                      Delete Property
                    </h3>
                    <p className="text-red-700/70 text-xs mt-0.5">
                      This action is permanent and cannot be undone.
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-xl px-6 font-bold"
                >
                  Remove Listing
                </Button>
              </div>
            </>
          )}

          {activeTab === "payments" && (
            <PaymentsTable
              payments={propertyPayments}
              loading={tabLoading}
              total={paymentsQuery.total}
              page={paymentsQuery.page}
              limit={paymentsQuery.limit}
              onPageChange={(newPage) => {
                void fetchPayments(
                  newPage,
                  paymentsQuery.limit,
                  paymentsQuery.type,
                  paymentsQuery.status,
                );
              }}
              onFilterChange={(type, status) => {
                void fetchPayments(1, paymentsQuery.limit, type, status);
              }}
            />
          )}

          {activeTab === "leases" && (
            <LeasesTable
              leases={propertyLeases}
              loading={tabLoading}
              total={leasesQuery.total}
              page={leasesQuery.page}
              limit={leasesQuery.limit}
              onPageChange={(newPage) => {
                void fetchLeases(
                  newPage,
                  leasesQuery.limit,
                  leasesQuery.status,
                );
              }}
              onFilterChange={(status) => {
                void fetchLeases(1, leasesQuery.limit, status);
              }}
            />
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {!tabLoading && propertyReviews.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-slate-900">
                        {(
                          propertyReviews.reduce(
                            (sum, r) => sum + r.rating,
                            0,
                          ) / propertyReviews.length
                        ).toFixed(1)}
                      </p>
                      <div className="flex items-center gap-0.5 justify-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const avg =
                            propertyReviews.reduce(
                              (sum, r) => sum + r.rating,
                              0,
                            ) / propertyReviews.length;
                          return (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(avg)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200 fill-slate-200"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {reviewsQuery.total} review
                        {reviewsQuery.total !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = propertyReviews.filter(
                          (r) => r.rating === star,
                        ).length;
                        const pct =
                          propertyReviews.length > 0
                            ? (count / propertyReviews.length) * 100
                            : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 w-4 text-right">
                              {star}
                            </span>
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 w-4">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-800 mb-5">
                  Tenant Reviews
                </h2>

                {tabLoading ? (
                  <div className="flex justify-center py-14">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  </div>
                ) : propertyReviews.length === 0 ? (
                  <div className="flex flex-col items-center py-14 text-center gap-3">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">
                      No reviews yet
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Tenant reviews will appear here once they submit feedback.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-slate-100">
                      {propertyReviews.map((review) => (
                        <div
                          key={review.id}
                          className="py-5 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-emerald-700">
                                {review.tenantName
                                  ? review.tenantName.charAt(0).toUpperCase()
                                  : "?"}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {review.tenantName || "Anonymous Tenant"}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {new Date(
                                      review.createdAt,
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>

                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < review.rating
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-slate-200 fill-slate-200"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-slate-500 ml-1 font-medium">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {reviewsQuery.total > reviewsQuery.limit && (
                      <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                          Showing{" "}
                          {Math.min(
                            (reviewsQuery.page - 1) * reviewsQuery.limit + 1,
                            reviewsQuery.total,
                          )}
                          –
                          {Math.min(
                            reviewsQuery.page * reviewsQuery.limit,
                            reviewsQuery.total,
                          )}{" "}
                          of {reviewsQuery.total} reviews
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              void fetchReviews(
                                reviewsQuery.page - 1,
                                reviewsQuery.limit,
                              )
                            }
                            disabled={reviewsQuery.page === 1 || tabLoading}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition"
                          >
                            ‹
                          </button>
                          {Array.from({
                            length: Math.ceil(
                              reviewsQuery.total / reviewsQuery.limit,
                            ),
                          }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                void fetchReviews(i + 1, reviewsQuery.limit)
                              }
                              className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                                reviewsQuery.page === i + 1
                                  ? "bg-emerald-600 text-white"
                                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              void fetchReviews(
                                reviewsQuery.page + 1,
                                reviewsQuery.limit,
                              )
                            }
                            disabled={
                              reviewsQuery.page ===
                                Math.ceil(
                                  reviewsQuery.total / reviewsQuery.limit,
                                ) || tabLoading
                            }
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
