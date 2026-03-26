'use client';

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft, Upload, Home, MapPin, IndianRupee,
  Maximize2, FileText, Image as ImageIcon, X, Sparkles,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from 'react-redux';
import {toast} from 'sonner'

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyFormValues} from "@/constants/propertyValidation";
import { propertySchema , amenitiesList } from "@/constants/propertyValidation";
import { fetchLandlordProperties, submitLandlordProperty } from '@/features/property/propertyThunk';
import { useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store/index";

import type { SubmitHandler } from "react-hook-form";


const statusOptions = ["Available","Rented", "Inactive"];
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
const propertyTypes = ["Apartment", "Villa", "House"];
const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];





interface AddPropertyPageProps {
  onBack?: () => void;
}

export default function AddPropertyPage({ onBack }: AddPropertyPageProps) {
  const dispatch = useAppDispatch();

  
  const userData = useSelector((state: RootState) => state.auth.userData);
  const { isSubmitting } = useSelector((state: RootState) => state.property);

  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [imageError, setImageError] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [touched, setTouched] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
   
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      type: "",
      bhk: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      price: "",
      securityDeposit: "",
      vacant: "",
      status: "Available",
      bedrooms: "",
      bathrooms: "",
      area: "",
      furnishing: "",
      description: "",
    },
  });

  
  const toggleAmenity = (label: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setImageError("");
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };


  const handleFormSubmit = (e: React.FormEvent) => {

  if (images.length < 3) {
    setImageError("Please upload at least 3 images");
  } else {
    setImageError("");
  }
  handleSubmit(onSubmit)(e);
};

  const onSubmit: SubmitHandler<PropertyFormValues> = async (data) => {
   setTouched(true);
    if (images.length < 3) {
      setImageError("Please upload at least 3 images");
      return;
    }

    setImageError("");

    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('bhk', data.bhk);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('pincode', data.pincode);
    formData.append('price', data.price.toString());
    formData.append('securityDeposit', data.securityDeposit.toString());
    formData.append('vacant', data.vacant.toString());
    formData.append('status', data.status);
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('area', data.area.toString());
    formData.append('furnishing', data.furnishing);
    formData.append('description', data.description);
    formData.append('amenities', JSON.stringify(selectedAmenities));

    images.forEach((img) => {
      formData.append('images', img.file);
    });

    if (userData?.id) {
      formData.append('landlordId', userData.id);
    }
    console.log("Formdaata:",formData)
    const result = await dispatch(submitLandlordProperty(formData) as any);

    if (submitLandlordProperty.fulfilled.match(result)) {
         toast.success('Property listed successfully!'); 
        dispatch(fetchLandlordProperties({ page: 1,search: '' }));

      onBack?.();
      reset();
      setImages([]);
      setSelectedAmenities([]);
    } else {
      toast.error('Property submission failed. Please try again.');
    }
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-10 py-10">

          {/* Header */}
          <div className="mb-8 pt-6 flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Add New Property</h1>
              <p className="text-slate-500 mt-1">Fill in the details to list your property</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>

            {/* ── Basic Info ── */}
            <Section icon={<Home size={18} />} title="Basic Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel>Property Title</FieldLabel>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. Luxury 3BHK Apartment in Bandra"
                        className={inputClass(!!errors.title)}
                      />
                    )}
                  />
                  <ErrorMsg msg={errors.title?.message} />
                </div>

                <div>
                  <FieldLabel>Property Type</FieldLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className={selectClass(!!errors.type)}>
                        <option value="">Select type</option>
                        {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                  />
                  <ErrorMsg msg={errors.type?.message} />
                </div>

                <div>
                  <FieldLabel>BHK Configuration</FieldLabel>
                  <Controller
                    name="bhk"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className={selectClass(!!errors.bhk)}>
                        <option value="">Select BHK</option>
                        {bhkOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    )}
                  />
                  <ErrorMsg msg={errors.bhk?.message} />
                </div>
              </div>
            </Section>

            {/* ── Location ── */}
            <Section icon={<MapPin size={18} />} title="Location Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel>Address</FieldLabel>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g. 12, Hill Road, Bandra West" className={inputClass(!!errors.address)} />
                    )}
                  />
                  <ErrorMsg msg={errors.address?.message} />
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g. Mumbai" className={inputClass(!!errors.city)} />
                    )}
                  />
                  <ErrorMsg msg={errors.city?.message} />
                </div>
                <div>
                  <FieldLabel>State</FieldLabel>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g. Maharashtra" className={inputClass(!!errors.state)} />
                    )}
                  />
                  <ErrorMsg msg={errors.state?.message} />
                </div>
                <div>
                  <FieldLabel>Pincode</FieldLabel>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g. 400050" maxLength={6} className={inputClass(!!errors.pincode)} />
                    )}
                  />
                  <ErrorMsg msg={errors.pincode?.message} />
                </div>
              </div>
            </Section>

            {/* ── Pricing & Availability ── */}
            <Section icon={<IndianRupee size={18} />} title="Pricing & Availability">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Monthly Rent (₹)</FieldLabel>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="text" placeholder="e.g. 45000"
                            onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        field.onChange(value || '');  
      }}
                        className={inputClass(!!errors.price)} />
                    )}
                  />
                  <ErrorMsg msg={errors.price?.message} />
                </div>
                <div>
                  <FieldLabel>Security Deposit (₹)</FieldLabel>
                  <Controller
                    name="securityDeposit"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="text" placeholder="e.g. 90000"
        onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        field.onChange(value || '');  
      }}
                        className={inputClass(!!errors.securityDeposit)} />
                    )}
                  />
                  <ErrorMsg msg={errors.securityDeposit?.message} />
                </div>
                <div>
                  <FieldLabel>Vacant Units</FieldLabel>
                  <Controller
                    name="vacant"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="text" placeholder="e.g. 2"
     onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        field.onChange(value || '');  
      }}
                        className={inputClass(!!errors.vacant)} />
                    )}
                  />
                  <ErrorMsg msg={errors.vacant?.message} />
                </div>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className={selectClass(!!errors.status)}>
                        
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  />
                  <ErrorMsg msg={errors.status?.message} />
                </div>
              </div>
            </Section>

            {/* ── Property Details ── */}
            <Section icon={<Maximize2 size={18} />} title="Property Details">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Bedrooms</FieldLabel>
                  <Controller
                    name="bedrooms"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="text" placeholder="e.g. 3"
                         onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        field.onChange(value || '');  
      }}
                        className={inputClass(!!errors.bedrooms)} />
                    )}
                  />
                  <ErrorMsg msg={errors.bedrooms?.message} />
                </div>
                <div>
                  <FieldLabel>Bathrooms</FieldLabel>
                  <Controller
                    name="bathrooms"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="text" placeholder="e.g. 2"
                        onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        field.onChange(value || '');  
      }}
                        className={inputClass(!!errors.bathrooms)} />
                    )}
                  />
                  <ErrorMsg msg={errors.bathrooms?.message} />
                </div>
                <div>
                  <FieldLabel>Area (sqft)</FieldLabel>
                  <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="text" placeholder="e.g. 1200"
                          onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        field.onChange(value || '');  
      }}
                        className={inputClass(!!errors.area)} />
                    )}
                  />
                  <ErrorMsg msg={errors.area?.message} />
                </div>
                <div>
                  <FieldLabel>Furnishing Status</FieldLabel>
                  <Controller
                    name="furnishing"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className={selectClass(!!errors.furnishing)}>
                        <option value="">Select furnishing</option>
                        {furnishingOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    )}
                  />
                  <ErrorMsg msg={errors.furnishing?.message} />
                </div>
              </div>
            </Section>

            {/* ── Amenities ── */}
            <Section icon={<Sparkles size={18} />} title="Amenities">
              <p className="text-sm text-slate-500 mb-4">
                Select all amenities available at your property
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {amenitiesList.map(({ label, emoji }) => {
                  const selected = selectedAmenities.includes(label);
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => toggleAmenity(label)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                        selected
                          ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                      }`}
                    >
                      <span className="text-base">{emoji}</span>
                      <span className="leading-tight">{label}</span>
                      {selected && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedAmenities.length > 0 && (
                <p className="mt-3 text-xs text-emerald-600 font-medium">
                  ✓ {selectedAmenities.length} amenit{selectedAmenities.length === 1 ? "y" : "ies"} selected
                </p>
              )}
            </Section>

            {/* ── Description ── */}
            <Section icon={<FileText size={18} />} title="Description">
              <FieldLabel>Property Description</FieldLabel>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Describe your property — nearby landmarks, special features, rules..."
                    className={`mt-1.5 resize-none ${
                      errors.description
                        ? "border-red-400 focus-visible:ring-red-400"
                        : "border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                    }`}
                  />
                )}
              />
              <ErrorMsg msg={errors.description?.message} />
            </Section>

        {/* ── Images ── */}
{/* ── Images ── */}
<Section icon={<ImageIcon size={18} />} title="Property Images">
  {/* Upload Area */}
  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 cursor-pointer group p-4">
    <Upload size={24} className="text-slate-400 group-hover:text-emerald-500 mb-2" />
    <span className="text-sm font-medium text-slate-500 group-hover:text-emerald-600">
      Click to upload images
    </span>
    <span className="text-xs text-slate-400 mt-1">
      PNG, JPG, WEBP up to 10MB • Minimum 3 images required
    </span>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>

  {/* ✅ FIXED Status Row - NO TypeScript error */}
  <div className="mt-4 flex items-center justify-between">
    <span className={`text-sm font-semibold ${images.length >= 3 ? "text-emerald-600" : "text-slate-500"}`}>
      {images.length} {images.length === 1 ? 'image' : 'images'} {images.length >= 3 ? '✓ Ready' : 'needed'}
    </span>
{imageError && (
  <span className="text-sm font-semibold text-red-500">
    {imageError}
  </span>
)}
  </div>

  {/* Image Previews */}
  {images.length > 0 && (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, i) => (
        <div key={i} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md border-2 border-slate-100 hover:border-emerald-300 bg-gradient-to-br from-slate-50 to-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
          <img 
            src={img.url} 
            alt={`Property image ${i + 1}`}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeImage(i);
            }}
            className="absolute top-3 right-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 hover:shadow-3xl transition-all duration-200 active:scale-95"
            title={`Remove image ${i + 1}`}
          >
            <X className="h-5 w-5 text-slate-700 hover:text-red-600 stroke-width-2.5 transition-all duration-200" />
          </button>
          
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full">
            {i + 1}
          </div>
        </div>
      ))}
    </div>
  )}
</Section>


            {/* ── Submit ── */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-10">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
                className="h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-8 font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "List Property"}
              </Button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputClass = (hasError: boolean) =>
  `mt-1.5 h-11 ${hasError ? "border-red-400 focus-visible:ring-red-400" : "border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"}`;

const selectClass = (hasError: boolean) =>
  `mt-1.5 w-full h-11 rounded-md border bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 ${hasError ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"}`;

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700">{children}</label>;
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500 font-medium">{msg}</p>;
}