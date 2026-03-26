'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  MapPin, BedDouble, Bath, Maximize2, ArrowLeft,
  Home, Phone, Mail, User, CheckCircle, Heart, Loader2,
  Wifi, Car, Wind, Droplets, Zap, Trees,
  Dumbbell, ShowerHead, UtensilsCrossed, Tv,
  MessageSquare, CalendarDays, Send, Share2,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import InquiryModal               from '@/components/inquiry/InquiryModal';
import Navbar                     from '@/components/layout/Navbar';
import { fetchTenantPropertyById } from '@/features/property/propertyThunk';
import type { Landlord }          from '@/features/property/types';
import { fetchWishlist, toggleWishlist } from '@/features/wishlist/wishlistThunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading map...</p>
    </div>
  ),
});

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi, Parking: Car, AC: Wind, Water: Droplets,
  'Power Backup': Zap, Garden: Trees, Gym: Dumbbell,
  Geyser: ShowerHead, 'Modular Kitchen': UtensilsCrossed, TV: Tv,
};

export default function PropertyDetailPage() {
  const { id }     = useParams<{ id: string }>();
  const dispatch   = useAppDispatch();
  const router     = useRouter();
  const { selectedProperty: property, isLoading } = useAppSelector(s => s.property);
  const { userData }               = useAppSelector(s => s.auth);
  const { wishlisted, togglingId } = useAppSelector(s => s.wishlist);

  const [activeImg,   setActiveImg]   = useState(0);
  const [imgErr,      setImgErr]      = useState<Record<number, boolean>>({});
  const [showInquiry, setShowInquiry] = useState(false);
  const [lightbox,    setLightbox]    = useState(false);

  const isWishlisted = property?._id ? wishlisted.includes(property._id) : false;
  const isToggling   = property?._id ? togglingId === property._id : false;

  useEffect(() => {
    if (id) void dispatch(fetchTenantPropertyById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (userData?.id) {
      void dispatch(fetchWishlist({ tenantId: userData.id, page: 1, limit: 100 }));
    }
  }, [userData?.id, dispatch]);

  const handleWishlist = () => {
    if (!userData?.id || !property) return;
    void dispatch(toggleWishlist({ tenantId: userData.id, propertyId: property._id, isWishlisted }))
      .then(result => {
        if (toggleWishlist.fulfilled.match(result)) {
          if (isWishlisted) toast.error('Removed from wishlist');
          else toast.success('Saved to wishlist!');
        }
      });
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!property)  return <NotFound />;

  const images   = property.images?.length ? property.images : [];

  function isLandlordObject(v: string | Landlord | undefined): v is Landlord {
    return typeof v === 'object' && v !== null && 'firstName' in v;
  }
  const landlord = isLandlordObject(property.landlordId) ? property.landlordId : null;

const amenitiesList: string[] = (() => {
  if (!property.amenities) return [];

  // Get the raw value — could be array with one JSON string element, or plain array
  const raw = Array.isArray(property.amenities)
    ? property.amenities[0]  // ← take the first element
    : property.amenities;

  // If the first element is already a plain string (not JSON), return all elements
  if (Array.isArray(property.amenities) && property.amenities.length > 1) {
    return property.amenities;
  }

  // Try to JSON parse the string
  try {
    const parsed = JSON.parse(raw as string);
    if (Array.isArray(parsed)) return parsed as string[];
    return [String(parsed)];
  } catch {
    // fallback: comma separated
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  }
})();


  return (
    <div className="min-h-screen bg-slate-50">
      <div className={showInquiry ? 'blur-sm pointer-events-none select-none' : ''}>
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">

          {/* ── Back button ── */}
          <Link href="/tenant/home">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-5 transition">
              <ArrowLeft size={16} /> Back to Search
            </button>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                <MapPin size={13} className="text-emerald-500 flex-shrink-0" />
                {[property.address, property.city, property.state].filter(Boolean).join(', ')}
              </div>

          {/* ── Top section: Image + Contact Card ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Image section — takes 2 cols */}
            <div className="lg:col-span-2">
              {/* Main image */}
              <div
                className="relative h-[400px] bg-slate-200 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setLightbox(true)}
              >
                {images.length > 0 && !imgErr[activeImg] ? (
                  <img
                    src={images[activeImg]}
                    alt={property.title}
                    onError={() => setImgErr(p => ({ ...p, [activeImg]: true }))}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home size={60} className="text-slate-300" />
                  </div>
                )}

                {/* Prev / Next */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white transition"
                    >
                      <ChevronLeft size={18} className="text-slate-700" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white transition"
                    >
                      <ChevronRight size={18} className="text-slate-700" />
                    </button>
                  </>
                )}

                {/* Counter + actions */}
              {/* Remove the entire Counter + actions div and replace with this: */}

{/* Counter */}
{images.length > 1 && (
  <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full">
    {activeImg + 1} / {images.length}
  </span>
)}



{/* Wishlist — top right, icon only */}
<button
  onClick={e => { e.stopPropagation(); handleWishlist(); }}
  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition-all"
>
  {isToggling
    ? <Loader2 size={16} className="animate-spin text-slate-400" />
    : <Heart size={16} className={isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-slate-500'} />
  }
</button>

                {/* Status badge */}
                {property.status && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                    property.status === 'Available' ? 'bg-emerald-500 text-white'
                    : property.status === 'Rented'  ? 'bg-rose-500 text-white'
                    : 'bg-slate-700 text-white'
                  }`}>
                    {property.status}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition ${
                        activeImg === i
                          ? 'border-emerald-500 opacity-100'
                          : 'border-transparent opacity-55 hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Contact / CTA card — right side ── */}
            <div className="lg:col-span-1 flex flex-col gap-4">

          {landlord && (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Listed by</p>
    <div className="flex items-center gap-3 mb-3">
       <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 flex-shrink-0">
                      {landlord.avatar
                        ? <img src={landlord.avatar} alt="" className="w-full h-full object-cover" />
                        : <User size={18} className="text-slate-400" />
                      }
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{landlord.firstName} {landlord.lastName}</p>
                      <p className="text-xs text-slate-400">Property Owner</p>
                    </div>
    </div>
    <div className="space-y-2 text-sm text-slate-600 mb-4">  
      {landlord.phone && (
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-emerald-500 flex-shrink-0" /> {landlord.phone}
        </div>
      )}
      {landlord.email && (
        <div className="flex items-center gap-2 min-w-0">
          <Mail size={13} className="text-emerald-500 flex-shrink-0" />
          <span className="truncate text-xs">{landlord.email}</span>
        </div>
      )}
    </div>

    {/* ← add divider before buttons */}
    <div className="border-t border-slate-100 pt-4 space-y-2.5">
      <Link href={`/tenant/home/${property._id}/schedule-visit`} className="block">
        <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
          <CalendarDays size={15} /> Schedule a Visit
        </button>
      </Link>
      <button
        onClick={() => setShowInquiry(true)}
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
      >
        <Send size={15} /> Send Inquiry
      </button>
      <button
        onClick={() => router.push('/tenant/chat')}
        className="w-full py-2.5 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
      >
        <MessageSquare size={15} /> Message
      </button>
    </div>
  </div>
)}

              

            </div>
          </div>

          {/* ── Bottom detail content ── */}
          <div className="max-w-3xl space-y-8">

            {/* Title & stats */}
            {/* <div className="pb-7 border-b border-slate-200"> */}
              {/* <h1 className="text-2xl font-bold text-slate-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                <MapPin size={13} className="text-emerald-500 flex-shrink-0" />
                {[property.address, property.city, property.state].filter(Boolean).join(', ')}
              </div> */}

              {/* <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-4">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <BedDouble size={15} className="text-slate-400" /> {property.bedrooms} <span className="font-normal text-slate-400">beds</span>
                </div>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Bath size={15} className="text-slate-400" /> {property.bathrooms} <span className="font-normal text-slate-400">baths</span>
                </div>
                <span className="text-slate-200">·</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Maximize2 size={15} className="text-slate-400" /> {property.area} <span className="font-normal text-slate-400">sqft</span>
                </div>
              </div> */}

              {/* <div className="flex flex-wrap gap-2">
                {[property.type, property.bhk, property.furnishing].filter(Boolean).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-full shadow-sm">{tag}</span>
                ))}
              </div>
            </div> */}

            {/* Description */}
            {property.description && (
              <div className="pb-7 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About this home</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{property.description}</p>
              </div>
            )}

            {/* Property details */}
            <div className="pb-7 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Property details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Bedrooms',   value: property.bedrooms },
                  { label: 'Bathrooms',  value: property.bathrooms },
                  { label: 'Area',       value: property.area ? `${property.area} sqft` : null },
                  { label: 'Type',       value: property.type },
                  { label: 'BHK',        value: property.bhk },
                  { label: 'Furnishing', value: property.furnishing },
                  { label: 'Status',     value: property.status },
                  { label: 'City',       value: property.city },
                  { label: 'State',      value: property.state },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} className="bg-white rounded-xl px-4 py-3 border border-slate-200">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-1">{d.label}</p>
                    <p className="text-sm font-semibold text-slate-800 capitalize">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
  <div className="pb-7 border-b border-slate-200">
    <h2 className="text-lg font-bold text-slate-900 mb-4">What this place offers</h2>
    <div className="grid grid-cols-2 gap-y-3 gap-x-8">
      {amenitiesList.map((a: string) => {
        const Icon = AMENITY_ICONS[a] ?? CheckCircle;
        return (
          <div key={a} className="flex items-center gap-3 text-sm text-emrald-700 py-2 border-b border-slate-100">
            <Icon size={16} className="text-emerald-600 flex-shrink-0" />
            {a}
          </div>
        );
      })}
    </div>
  </div>
)}
            {/* Map */}
            {property.coordinates && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Location</h2>
                <PropertyMap
                  lat={property.coordinates.lat}
                  lng={property.coordinates.lng}
                  title={property.title}
                  address={`${property.address}, ${property.city}`}
                  className="h-72 w-full rounded-2xl"
                />
                <p className="text-sm text-slate-500 mt-3">
                  {[property.address, property.city, property.state, property.pincode].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && images.length > 0 && (
        <div className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition" onClick={() => setLightbox(false)}>
            <X size={18} />
          </button>
          <button className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
            onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length); }}>
            <ChevronLeft size={20} />
          </button>
          <img src={images[activeImg]} alt="" className="max-h-[82vh] max-w-[82vw] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
          <button className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
            onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length); }}>
            <ChevronRight size={20} />
          </button>
          <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-sm">{activeImg + 1} / {images.length}</p>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setActiveImg(i); }}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition ${activeImg === i ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-70'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiry && landlord && (
        <InquiryModal
          propertyId={property._id}
          landlordId={landlord.id}
          propertyTitle={property.title}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 animate-pulse">
      <div className="max-w-6xl mx-auto">
        <div className="h-5 bg-slate-200 rounded w-32 mb-5" />
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <div className="h-[400px] bg-slate-200 rounded-2xl mb-3" />
            <div className="flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="w-20 h-14 bg-slate-100 rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-56 bg-white rounded-2xl border border-slate-200" />
            <div className="h-32 bg-white rounded-2xl border border-slate-200" />
          </div>
        </div>
        <div className="space-y-4 max-w-3xl">
          <div className="h-8 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Home size={28} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Listing not found</h2>
        <p className="text-slate-500 text-sm mb-8">This property may have been removed or is no longer available.</p>
        <Link href="/tenant/home">
          <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition">
            Back to Search
          </button>
        </Link>
      </div>
    </div>
  );
}