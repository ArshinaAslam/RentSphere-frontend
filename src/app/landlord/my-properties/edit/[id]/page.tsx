'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, MapPin, BedDouble, Bath, Maximize2, IndianRupee, Home, Sparkles, CheckCircle2, Upload, X } from "lucide-react";
import { useForm, Controller } from 'react-hook-form'; 
import toast from 'react-hot-toast';

import LandlordNavbar from "@/components/layout/LandlordNavbar";
import LandlordSidebar from "@/components/layout/LandlordSidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyFormValues} from '@/constants/propertyValidation';
import { amenitiesList, propertySchema } from '@/constants/propertyValidation';
import { clearSelectedProperty } from '@/features/property/propertySlice';
import { fetchLandlordPropertyById, fetchLandlordProperties, updateLandlordProperty } from '@/features/property/propertyThunk';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';


const statusOptions = ["Available", "Rented", "Inactive"];
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
const propertyTypes = ["Apartment", "Villa", "House"];
const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; url: string }[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('basic');
  const [imageError, setImageError] = useState('');

  const { selectedProperty, isLoading } = useAppSelector((state: RootState) => state.property);

  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '', description: '', price: '', bedrooms: '', bathrooms: '',
      area: '', address: '', city: '', state: '', pincode: '',
      status: 'Available', type: '', bhk: '', securityDeposit: '', 
      vacant: '', furnishing: '',
    },
  });

  const { control, handleSubmit, formState: { errors }, reset } = form;

  useEffect(() => {
    dispatch(fetchLandlordPropertyById({ id: propertyId }));
    return () => { dispatch(clearSelectedProperty()); };
  }, [dispatch, propertyId]);

  useEffect(() => {
    if (selectedProperty) {
      
      reset({
        title: selectedProperty.title || '',
        description: selectedProperty.description || '',
        price: selectedProperty.price?.toString() || '',
        bedrooms: selectedProperty.bedrooms?.toString() || '',
        bathrooms: selectedProperty.bathrooms?.toString() || '',
        area: selectedProperty.area?.toString() || '',
        address: selectedProperty.address || '',
        city: selectedProperty.city || '',
        state: selectedProperty.state || '',
        pincode: selectedProperty.pincode || '',
        status: selectedProperty.status || 'Available', 
        type: selectedProperty.type || '',
        bhk: selectedProperty.bhk || '',
        securityDeposit: selectedProperty.securityDeposit?.toString() || '',
        vacant: selectedProperty.vacant?.toString() || '',
        furnishing: selectedProperty.furnishing || '',
      });
      
      setExistingImages(selectedProperty.images || []);

      
      const rawAmenities = selectedProperty.amenities || [];
      let parsedAmenities: string[] = [];
      if (typeof rawAmenities === 'string') {
        try { parsedAmenities = JSON.parse(rawAmenities); } catch { parsedAmenities = []; }
      } else if (Array.isArray(rawAmenities)) {
        if (rawAmenities.length === 1 && typeof rawAmenities[0] === 'string' && rawAmenities[0].startsWith('[')) {
          try { parsedAmenities = JSON.parse(rawAmenities[0]); } catch { parsedAmenities = []; }
        } else {
          parsedAmenities = rawAmenities.filter((item): item is string => typeof item === 'string');
        }
      }
      setSelectedAmenities(parsedAmenities);
    }
  }, [selectedProperty, reset]);

  const toggleAmenity = (label: string) => {
    setSelectedAmenities(prev =>
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const imgs = Array.from(files).map(file => ({ file, url: URL.createObjectURL(file) }));
    setNewImages(prev => [...prev, ...imgs]);
    setImageError('');
  };

  const removeExisting = (i: number) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));
  const removeNew = (i: number) => {
    setNewImages(prev => { 
      URL.revokeObjectURL(prev[i].url); 
      return prev.filter((_, idx) => idx !== i); 
    });
  };

 
  const handleSave = handleSubmit(async (data: PropertyFormValues) => {
    const total = existingImages.length + newImages.length;
    if (total < 3) { 
      setImageError('Please keep at least 3 images');
      toast.error('Please keep at least 3 images');
      return; 
    }
    setImageError('');

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v));
      fd.append('amenities', JSON.stringify(selectedAmenities));
      fd.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach(img => fd.append('images', img.file));

     
      const result = await dispatch(updateLandlordProperty({ id: propertyId, formData: fd }) );
      if (updateLandlordProperty.fulfilled.match(result)) {
        toast.success('Property updated successfully!');
        dispatch(fetchLandlordProperties({ page: 1, search: '' }));
        router.push('/landlord/my-properties');
      }
    } catch {
      toast.error('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  });

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Home },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'pricing', label: 'Pricing', icon: IndianRupee },
    { id: 'details', label: 'Details', icon: Maximize2 },
    { id: 'amenities', label: 'Amenities', icon: Sparkles },
    { id: 'images', label: 'Images', icon: Upload },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <LandlordNavbar /><LandlordSidebar />
        <main className="pl-64 pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
            <p className="text-slate-600 font-medium">Loading property details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/20">
      <LandlordNavbar />
      <LandlordSidebar />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8 pt-4">
            <Link href="/landlord/my-properties"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition mb-5 group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Properties
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Edit Property</h1>
                <p className="text-slate-500 mt-1">
                  Editing — <span className="text-slate-700 font-medium">{selectedProperty?.title}</span>
                </p>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Horizontal Tab Bar */}
          <div className="flex items-center gap-1 bg-transparent border-b border-slate-200 pb-1 mb-6">
            {sections.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center border-b-2 -mb-[1px] ${
                  activeSection === id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {/* ── Basic Info ── */}
            {activeSection === 'basic' && (
              <Card title="Basic Information" icon={<Home size={16} />}>
                <div className="space-y-4">
                  <Field label="Property Title">
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          placeholder="e.g. Luxury 3BHK in Bandra" 
                          className={`${iClass} ${errors.title ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
                  </Field>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Property Type">
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <select {...field} className={`${sClass} ${errors.type ? 'border-red-300 ring-red-500/20' : ''}`}>
                            <option value="">Select type</option>
                            {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        )}
                      />
                      {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
                    </Field>
                    
                    <Field label="BHK Configuration">
                      <Controller
                        name="bhk"
                        control={control}
                        render={({ field }) => (
                          <select {...field} className={`${sClass} ${errors.bhk ? 'border-red-300 ring-red-500/20' : ''}`}>
                            <option value="">Select BHK</option>
                            {bhkOptions.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        )}
                      />
                      {errors.bhk && <p className="text-xs text-red-600 mt-1">{errors.bhk.message}</p>}
                    </Field>
                  </div>
                  
                  <Field label="Furnishing Status">
                    <Controller
                      name="furnishing"
                      control={control}
                      render={({ field }) => (
                        <select {...field} className={`${sClass} ${errors.furnishing ? 'border-red-300 ring-red-500/20' : ''}`}>
                          <option value="">Select furnishing</option>
                          {furnishingOptions.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      )}
                    />
                    {errors.furnishing && <p className="text-xs text-red-600 mt-1">{errors.furnishing.message}</p>}
                  </Field>
                  
                  <Field label="Description">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea 
                          {...field}
                          rows={4}
                          placeholder="Describe your property..." 
                          className={`resize-none border-slate-200 focus-visible:ring-emerald-500 rounded-xl ${errors.description ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
                  </Field>
                </div>
                <NavButtons next={() => setActiveSection('location')} />
              </Card>
            )}

            {/* ── Location ── */}
            {activeSection === 'location' && (
              <Card title="Location Details" icon={<MapPin size={16} />}>
                <div className="space-y-4">
                  <Field label="Full Address">
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          placeholder="Street, building, area" 
                          className={`${iClass} ${errors.address ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
                  </Field>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City">
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field}
                            placeholder="Mumbai" 
                            className={`${iClass} ${errors.city ? 'border-red-300 ring-red-500/20' : ''}`}
                          />
                        )}
                      />
                      {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
                    </Field>
                    
                    <Field label="State">
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field}
                            placeholder="Maharashtra" 
                            className={`${iClass} ${errors.state ? 'border-red-300 ring-red-500/20' : ''}`}
                          />
                        )}
                      />
                      {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state.message}</p>}
                    </Field>
                  </div>
                  
                  <Field label="Pincode">
                    <Controller
                      name="pincode"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          placeholder="400050" 
                          maxLength={6}
                          className={`${iClass} max-w-xs ${errors.pincode ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode.message}</p>}
                  </Field>
                </div>
                <NavButtons prev={() => setActiveSection('basic')} next={() => setActiveSection('pricing')} />
              </Card>
            )}

            {/* ── Pricing ── */}
            {activeSection === 'pricing' && (
              <Card title="Pricing & Availability" icon={<IndianRupee size={16} />}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Monthly Rent (₹)">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                      <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
                            }}
                            placeholder="45000" 
                            className={`${iClass} pl-7 ${errors.price ? 'border-red-300 ring-red-500/20' : ''}`}
                          />
                        )}
                      />
                    </div>
                    {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
                  </Field>
                  
                  <Field label="Security Deposit (₹)">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                      <Controller
                        name="securityDeposit"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
                            }}
                            placeholder="90000" 
                            className={`${iClass} pl-7 ${errors.securityDeposit ? 'border-red-300 ring-red-500/20' : ''}`}
                          />
                        )}
                      />
                    </div>
                    {errors.securityDeposit && <p className="text-xs text-red-600 mt-1">{errors.securityDeposit.message}</p>}
                  </Field>
                  
                  <Field label="Vacant Units">
                    <Controller
                      name="vacant"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                          placeholder="2" 
                          className={`${iClass} ${errors.vacant ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.vacant && <p className="text-xs text-red-600 mt-1">{errors.vacant.message}</p>}
                  </Field>
                  
                  <Field label="Status">
                    <Controller
                      name="status" // ✅ FIXED: status (not propertyStatus)
                      control={control}
                      render={({ field }) => (
                        <select {...field} className={`${sClass} ${errors.status ? 'border-red-300 ring-red-500/20' : ''}`}>
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    />
                    {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
                  </Field>
                </div>
                <NavButtons prev={() => setActiveSection('location')} next={() => setActiveSection('details')} />
              </Card>
            )}

            {/* ── Details ── */}
            {activeSection === 'details' && (
              <Card title="Property Details" icon={<Maximize2 size={16} />}>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Bedrooms" icon={<BedDouble size={15} />}>
                    <Controller
                      name="bedrooms"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                          placeholder="3" 
                          className={`${iClass} ${errors.bedrooms ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.bedrooms && <p className="text-xs text-red-600 mt-1">{errors.bedrooms.message}</p>}
                  </Field>
                  
                  <Field label="Bathrooms" icon={<Bath size={15} />}>
                    <Controller
                      name="bathrooms"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                          placeholder="2" 
                          className={`${iClass} ${errors.bathrooms ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.bathrooms && <p className="text-xs text-red-600 mt-1">{errors.bathrooms.message}</p>}
                  </Field>
                  
                  <Field label="Area (sqft)" icon={<Maximize2 size={15} />}>
                    <Controller
                      name="area"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                          placeholder="1200" 
                          className={`${iClass} ${errors.area ? 'border-red-300 ring-red-500/20' : ''}`}
                        />
                      )}
                    />
                    {errors.area && <p className="text-xs text-red-600 mt-1">{errors.area.message}</p>}
                  </Field>
                </div>
                <NavButtons prev={() => setActiveSection('pricing')} next={() => setActiveSection('amenities')} />
              </Card>
            )}

            {/* ── Amenities ── (unchanged) */}
            {activeSection === 'amenities' && (
              <Card title="Amenities" icon={<Sparkles size={16} />}>
                <p className="text-sm text-slate-500 mb-4">Select all amenities available at your property</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenitiesList.map(({ label, emoji }) => {
                    const selected = selectedAmenities.includes(label);
                    return (
                      <button type="button" key={label} onClick={() => toggleAmenity(label)}
                        disabled={selected}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                          selected
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-800 cursor-not-allowed opacity-70'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="flex-1">{label}</span>
                        {selected && <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {selectedAmenities.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Selected ({selectedAmenities.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map(a => {
                        const amenity = amenitiesList.find(item => item.label === a);
                        return (
                          <span key={a} className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-medium rounded-full">
                            <span>{amenity?.emoji ?? '✦'}</span>
                            <span>{a}</span>
                            <button type="button" onClick={() => toggleAmenity(a)}
                              className="w-4 h-4 rounded-full bg-emerald-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors ml-0.5"
                            >
                              <X size={9} />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <NavButtons prev={() => setActiveSection('details')} next={() => setActiveSection('images')} />
              </Card>
            )}

            {/* ── Images ── */}
            {activeSection === 'images' && (
              <Card title="Property Images" icon={<Upload size={16} />}>
                {imageError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">{imageError}</p>
                  </div>
                )}
                
                {(existingImages.length > 0 || newImages.length > 0) && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      All Images ({existingImages.length + newImages.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {existingImages.map((url, i) => (
                        <div key={`existing-${i}`} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md border-2 border-emerald-100 hover:border-red-300 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                          <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeExisting(i); }}
                            className="absolute top-3 right-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 hover:shadow-3xl transition-all duration-200 active:scale-95"
                            title="Remove image"
                          >
                            <X className="h-5 w-5 text-slate-700 hover:text-red-600 stroke-width-2.5 transition-all duration-200" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">Saved</div>
                        </div>
                      ))}

                      {newImages.map((img, i) => (
                        <div key={`new-${i}`} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md border-2 border-blue-100 hover:border-red-300 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                          <img src={img.url} alt={`New image ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeNew(i); }}
                            className="absolute top-3 right-3 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 hover:shadow-3xl transition-all duration-200 active:scale-95"
                            title="Remove image"
                          >
                            <X className="h-5 w-5 text-slate-700 hover:text-red-600 stroke-width-2.5 transition-all duration-200" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-blue-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">New</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition cursor-pointer group">
                  <Upload size={20} className="text-slate-400 group-hover:text-emerald-500 mb-1.5" />
                  <span className="text-sm font-medium text-slate-500 group-hover:text-emerald-600">Upload more images</span>
                  <span className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-sm font-medium ${existingImages.length + newImages.length >= 3 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {existingImages.length + newImages.length} total images
                    {existingImages.length + newImages.length >= 3 ? ' ✓ Ready' : ' — min 3 required'}
                  </span>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <NavButtons prev={() => setActiveSection('amenities')} />
                  <button onClick={handleSave} disabled={saving}
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 mt-4"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving Changes...' : 'Save All Changes'}
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Helpers (UNCHANGED) ──────────────────────────────────────────────────────
const iClass = "h-11 border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl";
const sClass = "w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">{icon}</span>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function NavButtons({ prev, next }: { prev?: () => void; next?: () => void }) {
  return (
    <div className="flex justify-between mt-6 pt-5 border-t border-slate-100">
      {prev ? (
        <button type="button" onClick={prev}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={15} /> Previous
        </button>
      ) : <span />}
      {next && (
        <button type="button" onClick={next}
          className="flex items-center gap-1.5 h-9 px-5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold transition"
        >
          Next <ArrowLeft size={15} className="rotate-180" />
        </button>
      )}
    </div>
  );
}
