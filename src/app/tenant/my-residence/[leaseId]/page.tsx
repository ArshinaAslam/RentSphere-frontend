"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Star,
  CheckCircle2,
  ArrowRight,
  Building2,
  Wifi,
  Car,
  Dumbbell,
  Wind,
  Tv,
  Shield,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PaymentsTable from "@/components/payments/PaymentTable";
import { fetchTenantLeases } from "@/features/lease/leaseThunk";
import { fetchTenantPropertyPayments } from "@/features/property/propertyThunk";
import type { PropertyPayment } from "@/features/property/types";
import { resetReviewState } from "@/features/review/reviewSlice";
import {
  fetchMyReview,
  submitPropertyReview,
} from "@/features/review/reviewThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  ac: Wind,
  tv: Tv,
  security: Shield,
};

function AmenityIcon({ name }: { name: string }) {
  const key = name.toLowerCase();
  const Icon =
    Object.entries(AMENITY_ICONS).find(([k]) => key.includes(k))?.[1] ??
    CheckCircle2;
  return <Icon className="w-4 h-4" />;
}

function StarRating({
  value,
  onChange,
  size = 6,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHovered(s)}
          onMouseLeave={() => onChange && setHovered(0)}
          disabled={!onChange}
          className="transition-transform hover:scale-110 disabled:cursor-default"
        >
          <Star
            className={`w-${size} h-${size} transition-colors ${
              s <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function MyResidencePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { leases } = useAppSelector((s) => s.lease);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { isSubmitting, success, error, existingReview } = useAppSelector(
    (s) => s.review,
  );

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tenantPayments, setTenantPayments] = useState<PropertyPayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsQuery, setPaymentsQuery] = useState({
    total: 0,
    page: 1,
    limit: 5,
    type: "",
    status: "",
  });
  type ResidenceTab = "details" | "payments";
  const [activeTab, setActiveTab] = useState<ResidenceTab>("details");

  const fetchPayments = async (
    page: number,
    limit: number,
    type: string,
    status: string,
  ) => {
    if (!property?._id) return;
    setPaymentsLoading(true);
    try {
      const result = await dispatch(
        fetchTenantPropertyPayments({
          propertyId: property._id,
          page,
          limit,
          type,
          status,
        }),
      ).unwrap();
      setTenantPayments(result.payments);
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
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    void dispatch(fetchTenantLeases());

    dispatch(resetReviewState());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const activeLease = leases.find((l) => l.status === "active") ?? null;
  const property = activeLease?.propertyId ?? null;

  useEffect(() => {
    if (property?._id) {
      void dispatch(fetchMyReview(property._id));
    }
  }, [property?._id, dispatch]);
  useEffect(() => {
    if (property?._id) {
      void fetchPayments(1, paymentsQuery.limit, "", "");
    }
  }, [property?._id]);

  if (!activeLease || !property) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Sidebar />
        <main className="pt-16 pl-64">
          <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-700">
              No Active Residence
            </h2>
            <p className="text-slate-400 text-sm max-w-xs">
              This section will show your living property once your lease
              becomes active.
            </p>
            <button
              onClick={() => router.push("/tenant/my-lease")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
            >
              View My Lease <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    void dispatch(
      submitPropertyReview({
        propertyId: property._id,
        leaseId: activeLease._id,
        rating,
        comment: review.trim(),
      }),
    );
  };

  useEffect(() => {
    if (success) toast.success("Review submitted! Thank you.");
  }, [success]);

  const images: string[] = property.images ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />

      <main className="pt-16 pl-64">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                🏠 Currently Living Here
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">My Residence</h1>
            <p className="text-slate-500 text-sm mt-1">
              Your current home details
            </p>
          </div>

          <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
            {(
              [
                { key: "details", label: "Details" },
                { key: "payments", label: "Payment History" },
              ] as { key: ResidenceTab; label: string }[]
            ).map((tab) => (
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
                  <div className="relative w-full h-full">
                    <img
                      src={images[selectedIndex]}
                      alt={`Property image ${selectedIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  {images.length > 1 && (
                    <button
                      onClick={() =>
                        setSelectedIndex(
                          (i) => (i - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xl transition opacity-0 group-hover:opacity-100"
                    >
                      ‹
                    </button>
                  )}
                  {images.length > 1 && (
                    <button
                      onClick={() =>
                        setSelectedIndex((i) => (i + 1) % images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xl transition opacity-0 group-hover:opacity-100"
                    >
                      ›
                    </button>
                  )}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedIndex(i)}
                          className={`rounded-full transition-all duration-300 ${
                            i === selectedIndex
                              ? "w-5 h-2 bg-white"
                              : "w-2 h-2 bg-white/50 hover:bg-white/80"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                    {selectedIndex + 1} / {images.length}
                  </div>
                  <div
                    className="absolute inset-0 z-0 cursor-zoom-in"
                    onClick={() => setSelectedImage(images[selectedIndex])}
                  />
                </div>
              )}

              {selectedImage && (
                <div
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedImage(null)}
                >
                  <div
                    className="relative max-w-4xl w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={selectedImage}
                      alt="Full view"
                      className="w-full max-h-[85vh] object-contain rounded-xl"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
                    >
                      ✕ Close
                    </button>
                    <p className="text-center text-white/50 text-xs mt-3">
                      {images.indexOf(selectedImage) + 1} / {images.length}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {property.title ?? "Your Property"}
                    </h2>
                    {property.address && (
                      <p className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.address}
                        {property.city ? `, ${property.city}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{(activeLease.rentAmount ?? 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-400">per month</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 py-4 border-y border-slate-100">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <BedDouble className="w-4 h-4" />
                      </div>
                      {property.bedrooms} Bedrooms
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Bath className="w-4 h-4" />
                      </div>
                      {property.bathrooms} Bathrooms
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Square className="w-4 h-4" />
                      </div>
                      {property.area} sq.ft
                    </div>
                  )}
                  {property.furnishing && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {property.furnishing}
                    </div>
                  )}
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((a: string) => (
                        <span
                          key={a}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                        >
                          <AmenityIcon name={a} />
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    {
                      label: "Lease Start",
                      value: new Date(activeLease.startDate).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "short", year: "numeric" },
                      ),
                    },
                    {
                      label: "Lease End",
                      value: new Date(activeLease.endDate).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "short", year: "numeric" },
                      ),
                    },
                    {
                      label: "Security Dep.",
                      value: `₹${(activeLease.securityDeposit ?? 0).toLocaleString("en-IN")}`,
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
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  Rate & Review This Property
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  Share your experience to help others make better decisions.
                </p>

                {success || existingReview ? (
                  <div className="flex flex-col items-center py-8 gap-3 text-center">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      Review Submitted!
                    </p>
                    <p className="text-xs text-slate-400">
                      Thank you for your feedback.
                    </p>
                    <StarRating
                      value={existingReview?.rating ?? rating}
                      size={5}
                    />
                    {(existingReview?.comment ?? review) && (
                      <p className="text-xs text-slate-500 max-w-sm italic">
                        "{existingReview?.comment ?? review}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Your Rating
                      </p>
                      <StarRating
                        value={rating}
                        onChange={setRating}
                        size={7}
                      />
                      {rating > 0 && (
                        <p className="text-xs text-slate-400 mt-1.5">
                          {
                            [
                              "",
                              "Poor",
                              "Fair",
                              "Good",
                              "Very Good",
                              "Excellent",
                            ][rating]
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Your Review
                      </p>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Describe your experience living here — cleanliness, landlord responsiveness, neighbourhood, etc."
                        rows={4}
                        maxLength={500}
                        className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 text-slate-800 placeholder:text-slate-400"
                      />
                      <p className="text-xs text-slate-400 text-right mt-1">
                        {review.length}/500
                      </p>
                    </div>
                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || rating === 0 || !review.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 text-white text-sm font-semibold rounded-xl transition"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isSubmitting ? "Submitting…" : "Submit Review"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "payments" && (
            <PaymentsTable
              payments={tenantPayments}
              loading={paymentsLoading}
              total={paymentsQuery.total}
              page={paymentsQuery.page}
              limit={paymentsQuery.limit}
              nameLabel="Landlord"
              nameValue={(p) => p.landlordName ?? ""}
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
        </div>
      </main>
    </div>
  );
}
