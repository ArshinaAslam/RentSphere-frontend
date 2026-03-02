'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  ChevronLeft, Trash2, Loader2, MapPin, BedDouble, Bath, Maximize,
  CheckCircle2, IndianRupee, Image as ImageIcon, ChevronRight, ArrowLeft, AlertTriangle
} from "lucide-react";

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clearSelectedProperty } from '@/features/property/propertySlice';
import { deleteLandlordProperty, fetchLandlordPropertyById } from '@/features/property/propertyThunk';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { selectedProperty, isLoading } = useAppSelector((state: RootState) => state.property);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteError, setDeleteError] = useState('');


  useEffect(() => {
    dispatch(fetchLandlordPropertyById({ id: propertyId }));
    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, propertyId]);

 
const handleDeleteConfirm = async () => {
  setDeleting(true);
  setDeleteError('');
  try {
    await dispatch(deleteLandlordProperty(propertyId)).unwrap();
    router.push('/landlord/my-properties');
  } catch (err: any) {
    setDeleteError(err.message || 'Failed to delete property');
  } finally {
    setDeleting(false);
    setShowDeleteModal(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <LandlordNavbar />
        <LandlordSidebar />
        <main className="pl-64 pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-lg text-slate-600">Loading property details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!selectedProperty) return null;

  // --- AMENITIES PARSING ---
  let displayAmenities: string[] = [];
  try {
    if (Array.isArray(selectedProperty.amenities) && selectedProperty.amenities.length > 0) {
      const first = selectedProperty.amenities[0];
      displayAmenities = (typeof first === 'string' && first.startsWith('[')) 
        ? JSON.parse(first) 
        : selectedProperty.amenities;
    }
  } catch (e) { displayAmenities = selectedProperty.amenities || []; }

  const images = selectedProperty.images || [];
  const hasMultipleImages = images.length > 1;

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      {/* <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="pl-64 h-16 flex items-center justify-between px-6">
          <Button variant="ghost" size="lg" asChild className="h-12 px-4 font-semibold hover:bg-emerald-50 hover:text-emerald-600 border border-emerald-200/50">
            <Link href="/landlord/my-properties" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Back to Properties
            </Link>
          </Button>
          <Button variant="destructive" size="sm"  onClick={() => setShowDeleteModal(true)} disabled={deleting} className="h-10 px-5 rounded-full font-medium gap-1.5">
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete</>}
          </Button>
        </div>
      </div> */}

      <LandlordNavbar />
      <LandlordSidebar />


      {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowDeleteModal(false)}
    />
    
    {/* Modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl border border-border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 pb-4 border-b border-border">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Delete Property</h2>
          <p className="text-muted-foreground text-center text-lg leading-relaxed">
            This action <span className="font-semibold text-red-600">cannot be undone</span>. 
            Are you sure you want to permanently delete this property?
          </p>
        </div>

        {/* Property Info */}
        <div className="px-8 py-6 border-b border-border bg-slate-50/50">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded-full">
              {propertyId.slice(-6).toUpperCase()}
            </span>
            <span className="font-semibold text-foreground truncate">{selectedProperty.title}</span>
          </div>
        </div>

        {/* Error */}
        {deleteError && (
          <div className="p-6 border-b border-border">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-red-800 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="p-8 pt-6 flex gap-3 bg-gradient-to-r from-slate-50/50">
          <Button 
            variant="outline" 
            className="flex-1 h-12 rounded-xl" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Delete Property'
            )}
          </Button>
        </div>
      </div>
    </div>
  </>
)}


      <main className="pl-64 pt-4 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          <div className="mb-6">
            <Link 
              href="/landlord/my-properties" 
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Return to My Properties
            </Link>
          </div>
          
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-full text-sm px-3 py-1 font-medium border-none">
                {selectedProperty.status}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono tracking-wider">{propertyId.slice(-6).toUpperCase()}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-3">{selectedProperty.title}</h1>
            <p className="flex items-center gap-2 text-lg text-muted-foreground">
              <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} - {selectedProperty.pincode}</span>
            </p>
          </div>

          {/*  IMAGE GALLERY SECTION */}
          <div className="mb-12">
            {/* Big Main Picture */}
            <div className="relative group">
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                {images.length > 0 ? (
                  <img
                    src={images[currentImageIndex]}
                    alt="Main Property View"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <ImageIcon className="w-20 h-20 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button onClick={goToPreviousImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={goToNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {hasMultipleImages && (
              <div className="flex gap-3 mt-6 px-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all duration-200 cursor-pointer hover:scale-105 ${
                      index === currentImageIndex ? 'border-emerald-400 ring-4 ring-emerald-200/50 shadow-lg' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={image} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-12">
                {[
                  { icon: BedDouble, value: selectedProperty.bedrooms, label: "Bedrooms", color: "from-emerald-50 to-emerald-100" },
                  { icon: Bath, value: selectedProperty.bathrooms, label: "Bathrooms", color: "from-blue-50 to-blue-100" },
                  { icon: Maximize, value: `${selectedProperty.area?.toLocaleString() || 0}`, label: "Sq. Feet", color: "from-indigo-50 to-indigo-100" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 flex-1 min-w-[140px]">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                      <stat.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground leading-tight">{stat.value}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-foreground mb-6">About this property</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                  {selectedProperty.description || "No description available."}
                </div>
              </div>

              {/* Amenities - 2 Column Grid */}
              {displayAmenities.length > 0 && (
                <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-foreground mb-8">What this place offers</h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {displayAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 py-1 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-red-50/50 rounded-3xl border border-red-100 p-8 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-900 leading-tight">Delete Property</h3>
                    <p className="text-red-700/70 text-sm mt-1">This action is permanent and cannot be undone.</p>
                  </div>
                </div>
               <Button 
  variant="destructive" 
  size="lg" 
  onClick={() => setShowDeleteModal(true)} 
  className="rounded-2xl px-8 font-bold shadow-md hover:shadow-lg transition-all"
>
  Remove Listing
</Button>
              </div>
            </div>

            {/* Sidebar Pricing */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-3xl border border-border p-8 shadow-xl">
                <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium mb-2">Monthly Rent</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <IndianRupee className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <span className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">{selectedProperty.price?.toLocaleString() || 0}</span>
                  <span className="text-lg text-muted-foreground">/mo</span>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Security Deposit</span>
                    <span className="font-semibold text-foreground">₹{selectedProperty.securityDeposit?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-semibold text-foreground capitalize">{selectedProperty.type}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">BHK</span>
                    <span className="font-semibold text-foreground">{selectedProperty.bhk}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-muted-foreground">Vacant</span>
                    <span className="font-semibold text-foreground">{selectedProperty.vacant} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}