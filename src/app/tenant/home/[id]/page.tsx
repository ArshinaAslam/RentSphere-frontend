'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  MapPin, BedDouble, Bath, Maximize2, ArrowLeft,
  ChevronLeft, ChevronRight, Home, Phone, Mail,
  User, CheckCircle,
  IndianRupee,
  Wifi, Car, Wind, Droplets, Zap, Trees,
  Dumbbell, ShowerHead, UtensilsCrossed, Tv
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import { fetchTenantPropertyById } from '@/features/property/propertyThunk';
import type { Landlord } from '@/features/property/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const AMENITY_ICONS: Record<string, any> = {
  WiFi: Wifi,
  Parking: Car,
  AC: Wind,
  Water: Droplets,
  'Power Backup': Zap,
  Garden: Trees,
  Gym: Dumbbell,
  Geyser: ShowerHead,
  'Modular Kitchen': UtensilsCrossed,
  TV: Tv,
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedProperty: property, isLoading } =
    useAppSelector((s) => s.property);

  const [activeImg, setActiveImg] = useState(0);
  const [imgErr, setImgErr] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (id) void dispatch(fetchTenantPropertyById(id));
  }, [id, dispatch]);

  if (isLoading) return <LoadingSkeleton />;
  if (!property) return <NotFound />;

  const images = property.images?.length ? property.images : [];


  function isLandlordObject(
    landlordId: string | Landlord | undefined
  ): landlordId is Landlord {
    return (
      typeof landlordId === 'object' &&
      landlordId !== null &&
      'firstName' in landlordId
    );
  }

  const landlord = isLandlordObject(property.landlordId)
    ? property.landlordId
    : null;

    
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar />

      

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">

        {/* HEADER */}
        <div className="mb-8">
          <Link href="/tenant/home">
            <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-3 uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" />
              Back to search
            </button>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">
            Property Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-8">

            {/* IMAGE CARD */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="relative h-[420px] bg-slate-100">
                {images.length > 0 && !imgErr[activeImg] ? (
                  <img
                    src={images[activeImg]}
                    alt={property.title}
                    onError={() =>
                      setImgErr((p) => ({ ...p, [activeImg]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home size={70} className="text-slate-300" />
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImg((i) =>
                          (i - 1 + images.length) % images.length
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                    >
                      <ChevronLeft />
                    </button>

                    <button
                      onClick={() =>
                        setActiveImg((i) =>
                          (i + 1) % images.length
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                    >
                      <ChevronRight />
                    </button>
                  </>
                )}
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="flex gap-3 p-4 bg-slate-50 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-24 h-16 rounded-lg overflow-hidden border-2 ${
                        activeImg === i
                          ? 'border-emerald-500'
                          : 'border-transparent opacity-60'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TITLE CARD */}
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-2">
                {property.title}
              </h2>

              <div className="flex items-center gap-2 text-slate-500 mb-6">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {[property.address, property.city, property.state]
                  .filter(Boolean)
                  .join(', ')}
              </div>

              <div className="text-3xl font-bold text-slate-900 mb-8">
                ₹{Number(property.price).toLocaleString('en-IN')}
                <span className="text-sm font-medium text-slate-500 ml-2">
                  per month
                </span>
              </div>

              <div className="flex gap-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-emerald-600" />
                  {property.bedrooms} Beds
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-emerald-600" />
                  {property.bathrooms} Baths
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-emerald-600" />
                  {property.area} sqft
                </div>
              </div>
            </div>

            {/* ABOUT */}
            {property.description && (
              <div className="bg-white rounded-xl border shadow-sm p-8">
                <h3 className="text-lg font-semibold mb-4">
                  About this property
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* KEY FEATURES */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-xl border shadow-sm p-8">
                <h3 className="text-lg font-semibold mb-6">
                  Features & Amenities
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((a: string) => {
                    const Icon = AMENITY_ICONS[a] || CheckCircle;
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-3 text-sm text-slate-700"
                      >
                        <span className="w-2 h-2 bg-amber-400 rounded-full" />
                        {a}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}

<div className="lg:col-span-1">
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sticky top-28">

    {/* Title */}
    <h3 className="text-lg font-bold text-slate-900 mb-6">
      Contact Landlord
    </h3>

    {/* Profile */}
    <div className="flex items-start gap-4 mb-6">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
        {landlord.avatar ? (
          <img
            src={landlord.avatar}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <User className="text-slate-500" />
        )}
      </div>

      <div>
        <p className="font-semibold text-slate-900">
          {landlord.firstName} {landlord.lastName}
        </p>

        <p className="text-sm text-slate-500">
          Property Owner
        </p>
      </div>
    </div>

    <div className="border-t border-slate-200 my-6" />

    {/* Contact Info */}
    <div className="space-y-4 text-sm text-slate-700 mb-6">
      <div className="flex items-center gap-3">
        <Phone size={16} className="text-emerald-600" />
        {landlord.phone}
      </div>

      <div className="flex items-center gap-3">
        <Mail size={16} className="text-emerald-600" />
        {landlord.email}
      </div>
    </div>

    <div className="border-t border-slate-200 my-6" />

   {/* Buttons */}
<div className="flex flex-col gap-4 mt-4">

  <Link
    href={`/tenant/home/${property._id}/schedule-visit`}
    className="w-full text-center py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition block"
  >
    Schedule Visit
  </Link>

  <Link
    href="/tenant/inquiry"
    className="w-full text-center py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition block"
  >
    Send Inquiry
  </Link>

  <button className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100 transition border border-emerald-200">
    Send Message
  </button>

</div>

  </div>
</div>

        </div>
      </div>
    </div>
  );
}


function StatCard({ icon, label, value }: { icon: any, label: string, value: any }) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="text-emerald-600 mb-2">{icon}</div>
      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{label}</p>
      <p className="text-base font-bold text-slate-900">{value || 'N/A'}</p>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: any, label: string, value: any }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <span className="text-emerald-500">{icon}</span>
      <div>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-700 capitalize">{value}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-32 px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[450px] bg-white rounded-3xl" />
          <div className="h-[450px] bg-white rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center p-8">
       <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center border border-slate-200">
         <Home size={60} className="text-slate-200 mx-auto mb-6" />
         <h2 className="text-2xl font-black text-slate-900 mb-2">Listing Not Found</h2>
         <p className="text-slate-500 mb-8">The property you are looking for might have been removed.</p>
         <Link href="/tenant/home" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100">
           Back to Search
         </Link>
       </div>
    </div>
  );
}